import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, LinearProgress, Box, Chip,
  useMediaQuery, useTheme,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import gsap from 'gsap';
import type { Adjustments } from '../types/adjustments';

interface BulkExportModalProps {
  open: boolean;
  onClose: () => void;
  files: File[];
  adjustments: Adjustments;
}

const FORMAT_OPTIONS = [
  { value: 'image/jpeg', label: 'JPEG', desc: 'Standard' },
  { value: 'image/png', label: 'PNG', desc: 'Lossless' },
  { value: 'image/tiff', label: 'TIFF', desc: 'Lossless' },
  { value: 'image/bmp', label: 'BMP', desc: 'Lossless' },
  { value: 'image/webp', label: 'WebP', desc: 'Modern' },
];

const BulkExportModal: React.FC<BulkExportModalProps> = ({ open, onClose, files, adjustments }) => {
  const [format, setFormat] = useState<string>('image/jpeg');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (open && contentRef.current) {
      gsap.fromTo(contentRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 0.1 });
    }
    if (open) { setIsDone(false); setProgress(0); }
  }, [open]);

  useEffect(() => {
    if (isDone && checkRef.current) {
      gsap.fromTo(checkRef.current, { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    }
  }, [isDone]);

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(0);
    for (let i = 0; i < files.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(((i + 1) / files.length) * 100);
    }
    setIsExporting(false);
    setIsDone(true);
  };

  const handleClose = () => {
    if (!isExporting) {
      onClose();
      setTimeout(() => { setIsDone(false); setProgress(0); }, 300);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" fullScreen={isMobile}>
      <Box ref={contentRef}>
        <DialogTitle sx={{
          pb: 1,
          background: 'linear-gradient(135deg, #e4e4eb 30%, #7c3aed)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          {isDone ? 'Export Complete' : 'Bulk Convert & Export'}
        </DialogTitle>

        <DialogContent>
          {isDone ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Box ref={checkRef} sx={{ display: 'inline-flex', mb: 2 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 56, color: '#06b6d4', filter: 'drop-shadow(0 0 16px rgba(6,182,212,0.4))' }} />
              </Box>
              <Typography sx={{ fontSize: '0.85rem', color: 'var(--ux-text-primary)', mb: 0.5 }}>
                Successfully converted {files.length} image{files.length !== 1 ? 's' : ''}
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: 'var(--ux-text-muted)' }}>
                Format: {FORMAT_OPTIONS.find(f => f.value === format)?.label}
              </Typography>
            </Box>
          ) : (
            <>
              <Typography sx={{ fontSize: '0.8rem', color: 'var(--ux-text-secondary)', mb: 2.5 }}>
                Export {files.length} image{files.length !== 1 ? 's' : ''} with current adjustments applied.
              </Typography>

              <Typography sx={{
                fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--ux-text-muted)', mb: 1.2,
              }}>
                Output Format
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {FORMAT_OPTIONS.map((opt) => (
                  <Chip key={opt.value}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span style={{ fontWeight: 600 }}>{opt.label}</span>
                        <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>{opt.desc}</span>
                      </Box>
                    }
                    onClick={() => !isExporting && setFormat(opt.value)}
                    variant={format === opt.value ? 'filled' : 'outlined'}
                    sx={{
                      borderRadius: '100px', fontSize: '0.75rem', height: 34,
                      cursor: isExporting ? 'default' : 'pointer', transition: 'all 0.25s ease',
                      ...(format === opt.value
                        ? {
                            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                            color: '#fff', border: 'none',
                            boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
                          }
                        : {
                            borderColor: 'rgba(255,255,255,0.1)', color: 'var(--ux-text-secondary)',
                            '&:hover': { borderColor: 'rgba(124, 58, 237, 0.4)', backgroundColor: 'rgba(124, 58, 237, 0.06)' },
                          }),
                    }}
                  />
                ))}
              </Box>

              {isExporting && (
                <Box sx={{ mt: 1 }}>
                  <LinearProgress variant="determinate" value={progress} sx={{ mb: 1.5 }} />
                  <Typography sx={{ fontSize: '0.72rem', textAlign: 'center', color: 'var(--ux-text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                    Converting… {Math.round(progress)}%
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          {isDone ? (
            <Button onClick={handleClose} variant="contained" sx={{ px: 3 }}>Done</Button>
          ) : (
            <>
              <Button onClick={handleClose} disabled={isExporting}
                sx={{ color: 'var(--ux-text-secondary)', '&:hover': { color: 'var(--ux-text-primary)' } }}>
                Cancel
              </Button>
              <Button onClick={handleExport} variant="contained" disabled={isExporting || files.length === 0} sx={{ px: 3 }}>
                {isExporting ? 'Exporting…' : 'Start Export'}
              </Button>
            </>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default BulkExportModal;
