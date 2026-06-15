import React, { useRef, useEffect } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import gsap from 'gsap';

interface MobileToolbarProps {
  activePanel: 'library' | 'adjustments' | 'tools' | null;
  onToggleLibrary: () => void;
  onToggleAdjustments: () => void;
  onToggleTools: () => void;
  onExport: () => void;
}

const MobileToolbar: React.FC<MobileToolbarProps> = ({
  activePanel, onToggleLibrary, onToggleAdjustments, onToggleTools, onExport,
}) => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (barRef.current) {
      gsap.fromTo(
        barRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.8 }
      );
    }
  }, []);

  const items = [
    { key: 'library' as const, icon: <PhotoLibraryOutlinedIcon />, label: 'Library', action: onToggleLibrary },
    { key: 'adjustments' as const, icon: <TuneOutlinedIcon />, label: 'Edit', action: onToggleAdjustments },
    { key: 'tools' as const, icon: <BrushOutlinedIcon />, label: 'Tools', action: onToggleTools },
    { key: null, icon: <FileDownloadOutlinedIcon />, label: 'Export', action: onExport },
  ];

  return (
    <Box
      ref={barRef}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        background: 'rgba(10, 10, 18, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {items.map((item) => {
        const isActive = item.key !== null && activePanel === item.key;
        return (
          <Tooltip key={item.label} title={item.label} arrow placement="top">
            <IconButton
              onClick={item.action}
              sx={{
                color: isActive ? '#7c3aed' : 'var(--ux-text-muted)',
                transition: 'all 0.25s ease',
                position: 'relative',
                '&:hover': { color: '#7c3aed' },
                '&::after': isActive ? {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 20,
                  height: 3,
                  borderRadius: '100px',
                  background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                } : {},
              }}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        );
      })}
    </Box>
  );
};

export default MobileToolbar;
