import ExifReader from 'exifreader';
import * as UTIF from 'utif2';
import exifr from 'exifr';

export const extractPreviewFromRaw = async (file: File): Promise<File> => {
  try {
    const buffer = await file.arrayBuffer();
    
    let bestImageBuf: ArrayBuffer | null = null;
    let maxLength = 0;

    // METHOD 1: Use UTIF2 to parse IFDs and locate the largest embedded JPEG stream directly
    // Using byte length instead of resolution fixes issues with NEF/DNG where width/height tags might be missing.
    try {
      const ifds = UTIF.decode(buffer);
      for (const ifd of ifds) {
        // Skip CFA (Bayer) sensor data (PhotometricInterpretation === 32803)
        const photoInterp = (ifd as any).t262 ? (ifd as any).t262[0] : null;
        if (photoInterp === 32803) continue;

        let offset = 0;
        let length = 0;

        // Check if it has a JPEG Interchange Format offset (t513) and length (t514)
        if ((ifd as any).t513 && (ifd as any).t514) {
          offset = (ifd as any).t513[0];
          length = (ifd as any).t514[0];
        } 
        // Check StripOffsets (t273) and StripByteCounts (t279) if Compression (t259) is JPEG (6 or 7)
        else if ((ifd as any).t259 && ((ifd as any).t259[0] === 6 || (ifd as any).t259[0] === 7) && (ifd as any).t273 && (ifd as any).t279) {
          offset = (ifd as any).t273[0];
          length = (ifd as any).t279[0];
        }

        if (length > maxLength && offset > 0) {
          maxLength = length;
          bestImageBuf = buffer.slice(offset, offset + length);
        }
      }
    } catch (e) {
      console.warn("UTIF2 IFD parsing failed:", e);
    }

    // METHOD 2: ExifReader Flat Tags (Fallback for formats where UTIF fails or misses MakerNotes)
    if (!bestImageBuf || maxLength < 100000) { // If UTIF failed or only found a tiny thumbnail (< 100KB)
      try {
        const tags = await ExifReader.load(buffer, { expanded: true });
        
        const images = (tags as any).Images;
        if (images && images.length > 0) {
          for (const img of images) {
            if (img.image && img.image.byteLength > maxLength) {
              bestImageBuf = img.image as ArrayBuffer;
              maxLength = bestImageBuf.byteLength;
            }
          }
        }

        const flatTags = await ExifReader.load(buffer);
        const possiblePrefixes = ['JpgFromRaw', 'PreviewImage', 'OtherImage', 'ThumbnailImage'];
        
        for (const prefix of possiblePrefixes) {
          const startTag = (flatTags as any)[`${prefix}Start`] || (flatTags as any)[`${prefix}Offset`];
          const lengthTag = (flatTags as any)[`${prefix}Length`] || (flatTags as any)[`${prefix}ByteCount`];
          
          if (startTag && lengthTag) {
            const offset = startTag.value;
            const len = lengthTag.value;
            if (typeof offset === 'number' && typeof len === 'number' && len > maxLength && offset > 0) {
              maxLength = len;
              bestImageBuf = buffer.slice(offset, offset + len);
            }
          }

          // Legacy check if ExifReader actually extracted it
          const t = (flatTags as any)[prefix];
          if (t && t.value) {
            const val = t.value;
            const buf = val.buffer || (val instanceof Uint8Array ? val.buffer : null);
            if (buf && buf.byteLength > maxLength) {
              bestImageBuf = buf;
              maxLength = buf.byteLength;
            } else if (Array.isArray(val) && val.length > maxLength) {
              const u8 = new Uint8Array(val);
              bestImageBuf = u8.buffer;
              maxLength = u8.byteLength;
            }
          }
        }

        // Only use Thumbnail tag if we absolutely have nothing else
        if (!bestImageBuf && flatTags['Thumbnail']?.image) {
          const thumbBuf = flatTags['Thumbnail'].image as ArrayBuffer;
          if (thumbBuf.byteLength > maxLength) {
              bestImageBuf = thumbBuf;
          }
        }
      } catch (e) {
        console.warn("ExifReader fallback failed:", e);
      }
    }

    // METHOD 3: EXIFR (Ultimate fallback for difficult formats like ARW or complex NEFs)
    if (!bestImageBuf || maxLength < 100000) {
      try {
        const thumb = await exifr.thumbnail(buffer);
        if (thumb && thumb.byteLength > maxLength) {
          const buf = thumb.buffer || thumb;
          if (buf instanceof ArrayBuffer) {
            bestImageBuf = buf;
          } else if (buf instanceof SharedArrayBuffer) {
            const u8 = new Uint8Array(buf);
            bestImageBuf = new Uint8Array(u8).buffer;
          }
          maxLength = thumb.byteLength;
        }
      } catch (e) {
        console.warn("EXIFR fallback failed:", e);
      }
    }

    // METHOD 4: Brute-force JPEG Magic Byte Scanner (The Ultimate Fallback)
    // If all EXIF/TIFF parsing fails, we scan the binary buffer for JPEG SOI (FF D8 FF) 
    // and EOI (FF D9) markers and extract the largest contiguous stream.
    if (!bestImageBuf || maxLength < 100000) {
      try {
        const u8 = new Uint8Array(buffer);
        const starts: number[] = [];
        for (let i = 0; i < u8.length - 2; i++) {
          if (u8[i] === 0xFF && u8[i+1] === 0xD8 && u8[i+2] === 0xFF) {
            starts.push(i);
          }
        }

        for (let i = 0; i < starts.length; i++) {
          const start = starts[i];
          const searchEnd = i < starts.length - 1 ? starts[i + 1] : u8.length;
          
          let end = -1;
          for (let j = searchEnd - 2; j >= start; j--) {
             if (u8[j] === 0xFF && u8[j+1] === 0xD9) {
                 end = j + 2;
                 break;
             }
          }

          const finalEnd = end !== -1 ? end : searchEnd;
          const length = finalEnd - start;
          
          // We assume a valid preview is at least 50KB
          if (length > maxLength && length > 50000) {
            maxLength = length;
            bestImageBuf = buffer.slice(start, finalEnd);
          }
        }
      } catch (e) {
        console.warn("Brute-force scan failed:", e);
      }
    }

    if (bestImageBuf && bestImageBuf.byteLength > 0) {
      // Check if the extracted buffer actually has JPEG magic bytes (FF D8)
      const view = new DataView(bestImageBuf);
      if (view.byteLength > 2 && view.getUint8(0) === 0xFF && view.getUint8(1) === 0xD8) {
        const blob = new Blob([bestImageBuf], { type: 'image/jpeg' });
        const newFileName = file.name.replace(/\.[^/.]+$/, ".jpg");
        return new File([blob], newFileName, { type: 'image/jpeg', lastModified: file.lastModified });
      }
    }

    console.warn(`No high-res embedded JPEG found for ${file.name}. Proceeding with original file.`);
    return file;
  } catch (error) {
    console.error("Error parsing RAW file:", error);
    return file;
  }
};
