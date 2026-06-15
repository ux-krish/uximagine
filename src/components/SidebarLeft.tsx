import React, { useRef, useEffect, useCallback } from 'react';
import { Box, Typography, Button, List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import gsap from 'gsap';

interface SidebarLeftProps {
  files: File[];
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectFile: (file: File) => void;
  onAddFile?: (file: File) => void;
  currentFile?: File | null;
}

const SidebarLeft: React.FC<SidebarLeftProps> = ({ files, onFileChange, onSelectFile, onAddFile, currentFile }) => {
  const listRef = useRef<HTMLUListElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const importBtnRef = useRef<any>(null);
  const prevFilesCount = useRef(0);

  useEffect(() => {
    if (files.length > prevFilesCount.current && listRef.current) {
      const newItems = Array.from(listRef.current.children).slice(prevFilesCount.current);
      if (newItems.length > 0) {
        gsap.fromTo(newItems, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out', stagger: 0.05 });
      }
    }
    prevFilesCount.current = files.length;
  }, [files.length]);

  const handleImportHover = () => {
    if (importBtnRef.current) gsap.to(importBtnRef.current, { scale: 1.03, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
  };
  const handleImportLeave = () => {
    if (importBtnRef.current) gsap.to(importBtnRef.current, { scale: 1, duration: 0.25, ease: 'power2.out' });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (dropZoneRef.current) gsap.to(dropZoneRef.current, { borderColor: '#7c3aed', scale: 1.02, duration: 0.3, ease: 'power2.out' });
  }, []);

  const handleDragLeave = useCallback(() => {
    if (dropZoneRef.current) gsap.to(dropZoneRef.current, { borderColor: 'rgba(255,255,255,0.08)', scale: 1, duration: 0.3 });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleDragLeave();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && onAddFile) {
      Array.from(e.dataTransfer.files).forEach(file => onAddFile(file));
    }
  }, [handleDragLeave, onAddFile]);

  const handleTakePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      if (image.webPath && onAddFile) {
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        const file = new File([blob], `photo_${Date.now()}.${image.format}`, { type: `image/${image.format}` });
        onAddFile(file);
      }
    } catch (error) {
      console.error('Camera error', error);
    }
  };

  return (
    <Box
      sx={{
        width: { xs: '100%', md: 200, lg: 240 },
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(10, 10, 18, 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: { xs: 'none', md: '1px solid rgba(255,255,255,0.04)' },
        overflow: 'hidden',
        height: '100%',
      }}
    >
      {/* Section Label */}
      <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
        <Typography
          variant="subtitle2"
          sx={{ textTransform: 'uppercase', color: 'var(--ux-text-muted)', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.12em' }}
        >
          Library
        </Typography>
      </Box>

      {/* Import & Camera Buttons */}
      <Box sx={{ px: 1.5, pb: 1, display: 'flex', gap: 1 }}>
        <Button
          ref={importBtnRef} variant="outlined" component="label" fullWidth
          onMouseEnter={handleImportHover} onMouseLeave={handleImportLeave}
          startIcon={<AddPhotoAlternateOutlinedIcon sx={{ fontSize: 16 }} />}
          sx={{ borderStyle: 'dashed', borderWidth: '1.5px', py: 1, fontSize: '0.75rem', paddingX: 0 }}
        >
          Import
          <input type="file" hidden multiple accept=".cr2,.nef,.arw,.dng,.jpg,.png,.jpeg,.webp" onChange={onFileChange} />
        </Button>
        <Button
          variant="outlined" fullWidth onClick={handleTakePhoto}
          startIcon={<CameraAltOutlinedIcon sx={{ fontSize: 16 }} />}
          sx={{ borderStyle: 'dashed', borderWidth: '1.5px', py: 1, fontSize: '0.75rem', paddingX: 0 }}
        >
          Camera
        </Button>
      </Box>

      {/* Drop Zone */}
      {files.length === 0 && (
        <Box
          ref={dropZoneRef}
          onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
          sx={{
            mx: 1.5, mt: 0.5, p: 3, borderRadius: '12px', border: '1.5px dashed rgba(255,255,255,0.08)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
            transition: 'border-color 0.3s ease', cursor: 'pointer',
          }}
        >
          <CloudUploadOutlinedIcon sx={{ fontSize: 28, color: 'var(--ux-text-muted)', animation: 'floatUp 3s ease-in-out infinite' }} />
          <Typography sx={{ fontSize: '0.68rem', color: 'var(--ux-text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
            Drop RAW or image files here
          </Typography>
          <Typography sx={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.15)' }}>
            CR2 · NEF · ARW · DNG · JPG · PNG
          </Typography>
        </Box>
      )}

      {/* File count */}
      {files.length > 0 && (
        <Box sx={{ px: 2, py: 0.8 }}>
          <Typography sx={{ fontSize: '0.65rem', color: 'var(--ux-text-muted)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box component="span" sx={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', display: 'inline-block',
            }} />
            {files.length} image{files.length !== 1 ? 's' : ''} loaded
          </Typography>
        </Box>
      )}

      {/* File List */}
      <List ref={listRef} sx={{ flexGrow: 1, overflowY: 'auto', px: 0.8, pb: 1 }}>
        {files.map((file, idx) => {
          const isSelected = currentFile === file;
          return (
            <ListItemButton key={idx} onClick={() => onSelectFile(file)}
              selected={isSelected}
              sx={{ py: 0.6, px: 1.2 }}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <Box sx={{
                  width: 24, height: 24, borderRadius: '6px',
                  background: isSelected ? 'rgba(124, 58, 237, 0.2)' : 'rgba(124, 58, 237, 0.1)',
                  border: `1px solid ${isSelected ? 'rgba(124, 58, 237, 0.4)' : 'rgba(124, 58, 237, 0.15)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  <ImageOutlinedIcon sx={{ fontSize: 13, color: '#7c3aed' }} />
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary={file.name.length > 22 ? file.name.substring(0, 12) + '...' + file.name.slice(-7) : file.name}
                title={file.name}
                sx={{ fontSize: '0.72rem', fontWeight: isSelected ? 500 : 400, color: 'var(--ux-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
};

export default SidebarLeft;
