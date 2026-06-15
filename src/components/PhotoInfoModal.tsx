import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, Typography,
  Box, IconButton, Grid, Divider, CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import IsoOutlinedIcon from '@mui/icons-material/IsoOutlined';
import LensOutlinedIcon from '@mui/icons-material/LensOutlined';
import ShutterSpeedOutlinedIcon from '@mui/icons-material/ShutterSpeedOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined';
import exifr from 'exifr';

interface PhotoInfoModalProps {
  open: boolean;
  onClose: () => void;
  file: File | null;
}

interface ExifData {
  make?: string;
  model?: string;
  lens?: string;
  iso?: number;
  fNumber?: number;
  exposureTime?: number;
  focalLength?: number;
  date?: string;
  width?: number;
  height?: number;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const formatExposureTime = (seconds?: number) => {
  if (!seconds) return 'Unknown';
  if (seconds >= 1) return `${seconds}s`;
  return `1/${Math.round(1 / seconds)}s`;
};

const PhotoInfoModal: React.FC<PhotoInfoModalProps> = ({ open, onClose, file }) => {
  const [loading, setLoading] = useState(false);
  const [exif, setExif] = useState<ExifData | null>(null);

  useEffect(() => {
    let active = true;
    const parseExif = async () => {
      if (!file) return;
      setLoading(true);
      try {
        const data = await exifr.parse(file, true); // true = all segments
        if (active) {
          // Sometimes width/height aren't in EXIF, so we might need fallback
          let width = data?.ExifImageWidth || data?.ImageWidth;
          let height = data?.ExifImageHeight || data?.ImageHeight;
          
          if (!width || !height) {
            // Fallback to reading image natural dimensions
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
              if (active) {
                setExif(prev => prev ? { ...prev, width: img.naturalWidth, height: img.naturalHeight } : { width: img.naturalWidth, height: img.naturalHeight });
              }
              URL.revokeObjectURL(url);
            };
            img.src = url;
          }

          setExif({
            make: data?.Make,
            model: data?.Model,
            lens: data?.LensModel,
            iso: data?.ISO,
            fNumber: data?.FNumber,
            exposureTime: data?.ExposureTime,
            focalLength: data?.FocalLength,
            date: data?.DateTimeOriginal || data?.CreateDate || data?.ModifyDate,
            width,
            height
          });
        }
      } catch (err) {
        console.warn('EXIF parse error:', err);
        // Fallback for non-exif files
        if (active) {
          const url = URL.createObjectURL(file);
          const img = new Image();
          img.onload = () => {
            if (active) setExif({ width: img.naturalWidth, height: img.naturalHeight });
            URL.revokeObjectURL(url);
          };
          img.src = url;
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    if (open && file) {
      parseExif();
    } else {
      setExif(null);
    }

    return () => { active = false; };
  }, [file, open]);

  if (!file) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          background: 'rgba(15, 15, 20, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 3,
          color: 'white',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Photo Information</Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'var(--ux-text-muted)' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
      <DialogContent sx={{ minHeight: 250 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress size={30} sx={{ color: '#7c3aed' }} />
          </Box>
        ) : (
          <Box sx={{ py: 1 }}>
            {/* File Info */}
            <Typography variant="overline" sx={{ color: '#7c3aed', fontWeight: 600, letterSpacing: 1.5 }}>
              File Details
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3, mt: 0.5 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <InsertDriveFileOutlinedIcon sx={{ color: 'var(--ux-text-muted)', fontSize: 20 }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', color: 'var(--ux-text-muted)' }}>Name</Typography>
                    <Typography sx={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>{file.name}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: 'var(--ux-text-muted)' }}>Size</Typography>
                  <Typography sx={{ fontSize: '0.85rem' }}>{formatBytes(file.size)}</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: 'var(--ux-text-muted)' }}>Format</Typography>
                  <Typography sx={{ fontSize: '0.85rem' }}>{file.type || file.name.split('.').pop()?.toUpperCase()}</Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Camera Info */}
            {(exif?.make || exif?.model || exif?.date || exif?.width) && (
              <>
                <Typography variant="overline" sx={{ color: '#06b6d4', fontWeight: 600, letterSpacing: 1.5 }}>
                  Camera & Image
                </Typography>
                <Grid container spacing={3} sx={{ mt: 0.5 }}>
                  {exif?.make && exif?.model && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CameraAltOutlinedIcon sx={{ color: 'var(--ux-text-muted)', fontSize: 20 }} />
                        <Box>
                          <Typography sx={{ fontSize: '0.75rem', color: 'var(--ux-text-muted)' }}>Camera</Typography>
                          <Typography sx={{ fontSize: '0.85rem' }}>{exif.make} {exif.model}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  {exif?.lens && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <LensOutlinedIcon sx={{ color: 'var(--ux-text-muted)', fontSize: 20 }} />
                        <Box>
                          <Typography sx={{ fontSize: '0.75rem', color: 'var(--ux-text-muted)' }}>Lens</Typography>
                          <Typography sx={{ fontSize: '0.85rem' }}>{exif.lens}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <AspectRatioOutlinedIcon sx={{ color: 'var(--ux-text-muted)', fontSize: 20 }} />
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: 'var(--ux-text-muted)' }}>Dimensions</Typography>
                        <Typography sx={{ fontSize: '0.85rem' }}>
                          {exif?.width && exif?.height ? `${exif.width} × ${exif.height}` : 'Unknown'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  {exif?.date && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <DateRangeOutlinedIcon sx={{ color: 'var(--ux-text-muted)', fontSize: 20 }} />
                        <Box>
                          <Typography sx={{ fontSize: '0.75rem', color: 'var(--ux-text-muted)' }}>Date Taken</Typography>
                          <Typography sx={{ fontSize: '0.85rem' }}>
                            {new Date(exif.date).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>

                {/* Exposure */}
                {(exif?.iso || exif?.fNumber || exif?.exposureTime || exif?.focalLength) && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <IsoOutlinedIcon sx={{ fontSize: 18, color: 'var(--ux-text-muted)', mb: 0.5 }} />
                      <Typography sx={{ fontSize: '0.7rem', color: 'var(--ux-text-muted)' }}>ISO</Typography>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>{exif.iso || '-'}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <LensOutlinedIcon sx={{ fontSize: 18, color: 'var(--ux-text-muted)', mb: 0.5 }} />
                      <Typography sx={{ fontSize: '0.7rem', color: 'var(--ux-text-muted)' }}>Aperture</Typography>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>{exif.fNumber ? `f/${exif.fNumber}` : '-'}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <ShutterSpeedOutlinedIcon sx={{ fontSize: 18, color: 'var(--ux-text-muted)', mb: 0.5 }} />
                      <Typography sx={{ fontSize: '0.7rem', color: 'var(--ux-text-muted)' }}>Shutter</Typography>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>{formatExposureTime(exif.exposureTime)}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <AspectRatioOutlinedIcon sx={{ fontSize: 18, color: 'var(--ux-text-muted)', mb: 0.5 }} />
                      <Typography sx={{ fontSize: '0.7rem', color: 'var(--ux-text-muted)' }}>Focal Length</Typography>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>{exif.focalLength ? `${exif.focalLength}mm` : '-'}</Typography>
                    </Box>
                  </Box>
                )}
              </>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhotoInfoModal;
