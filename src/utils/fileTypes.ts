export const SUPPORTED_RAW_EXTENSIONS = [
  '.cr2', '.cr3', '.nef', '.arw', '.dng', '.raf', '.orf', '.rw2', '.sr2', '.pef'
];

export const SUPPORTED_IMAGE_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.webp', '.avif', '.heic', ...SUPPORTED_RAW_EXTENSIONS
];

export const isRawFile = (filename: string): boolean => {
  const lower = filename.toLowerCase();
  return SUPPORTED_RAW_EXTENSIONS.some(ext => lower.endsWith(ext));
};
