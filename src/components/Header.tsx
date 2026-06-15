import React, { useRef, useEffect } from 'react';
import { Box, Typography, Button, Tooltip, IconButton, useMediaQuery, useTheme } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import RedoOutlinedIcon from '@mui/icons-material/RedoOutlined';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import gsap from 'gsap';

interface HeaderProps {
  onExport: () => void;
  onToggleLeft?: () => void;
  onToggleRight?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  leftOpen?: boolean;
  rightOpen?: boolean;
  onShowInfo?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onExport, onToggleLeft, onToggleRight,
  onUndo, onRedo, canUndo = false, canRedo = false,
  leftOpen = true, rightOpen = true, onShowInfo
}) => {
  const exportBtnRef = useRef<HTMLButtonElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const glowLineRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(logoRef.current, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 });
    }
    if (glowLineRef.current) {
      gsap.fromTo(glowLineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power4.out', delay: 0.5 });
    }
  }, []);

  const handleExportHover = () => {
    if (exportBtnRef.current) gsap.to(exportBtnRef.current, { scale: 1.06, duration: 0.35, ease: 'elastic.out(1, 0.4)' });
  };
  const handleExportLeave = () => {
    if (exportBtnRef.current) gsap.to(exportBtnRef.current, { scale: 1, duration: 0.3, ease: 'power2.out' });
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 48, md: 56 },
        display: 'flex',
        alignItems: 'center',
        px: { xs: 1.5, md: 2.5 },
        justifyContent: 'space-between',
        background: 'rgba(10, 10, 18, 0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        zIndex: 10,
        gap: 1,
      }}
    >
      {/* Left: Logo + Toggle */}
      <Box ref={logoRef} sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.8, md: 1.2 }, minWidth: 0 }}>
        {/* Panel toggle (tablet+desktop) */}
        {!isMobile && onToggleLeft && (
          <Tooltip title="Toggle Library" arrow>
            <IconButton
              size="small" onClick={onToggleLeft}
              sx={{
                color: leftOpen ? '#7c3aed' : 'var(--ux-text-muted)',
                transition: 'color 0.2s',
                transform: 'scaleX(-1)',
              }}
            >
              <ViewSidebarOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}

        <Box
          sx={{
            width: { xs: 26, md: 30 }, height: { xs: 26, md: 30 },
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 18px rgba(124, 58, 237, 0.3)', flexShrink: 0,
          }}
        >
          <AutoFixHighIcon sx={{ fontSize: { xs: 14, md: 17 }, color: '#fff' }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700, fontSize: { xs: '0.85rem', md: '1rem' }, letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #e4e4eb 30%, #7c3aed 70%, #06b6d4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            whiteSpace: 'nowrap',
          }}
        >
          UXImagine
        </Typography>
        {!isMobile && (
          <Typography sx={{
            fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', color: '#06b6d4',
            background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)',
            borderRadius: '100px', px: 1, py: 0.2, textTransform: 'uppercase',
          }}>
            RAW
          </Typography>
        )}
      </Box>

      {/* Center: Undo/Redo + Keyboard hints */}
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
        {/* Undo / Redo */}
        {onUndo && (
          <Tooltip title="Undo (Ctrl+Z)" arrow>
            <span>
              <IconButton size="small" onClick={onUndo} disabled={!canUndo}
                sx={{ color: canUndo ? 'var(--ux-text-secondary)' : 'var(--ux-text-muted)', transition: 'color 0.2s' }}>
                <UndoOutlinedIcon sx={{ fontSize: { xs: 16, md: 18 } }} />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {onRedo && (
          <Tooltip title="Redo (Ctrl+Y)" arrow>
            <span>
              <IconButton size="small" onClick={onRedo} disabled={!canRedo}
                sx={{ color: canRedo ? 'var(--ux-text-secondary)' : 'var(--ux-text-muted)', transition: 'color 0.2s' }}>
                <RedoOutlinedIcon sx={{ fontSize: { xs: 16, md: 18 } }} />
              </IconButton>
            </span>
          </Tooltip>
        )}

        {/* Keyboard hints (desktop only) */}
        {!isMobile && !isTablet && (
          <>
            <Box sx={{ width: '1px', height: 16, background: 'rgba(255,255,255,0.06)', mx: 0.5 }} />
            {['⌘ 0', '⌘ \\'].map((hint) => (
              <Box key={hint} sx={{
                fontSize: '0.6rem', color: 'var(--ux-text-muted)',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '6px', px: 0.8, py: 0.2, cursor: 'default', transition: 'all 0.2s',
                '&:hover': { color: 'var(--ux-text-secondary)', borderColor: 'rgba(255,255,255,0.1)' },
              }}>
                {hint}
              </Box>
            ))}
          </>
        )}
      </Box>

      {/* Right: Toggle + Export */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
        {/* Right panel toggle (tablet+desktop) */}
        {!isMobile && onToggleRight && (
          <Tooltip title="Toggle Adjustments" arrow>
            <IconButton size="small" onClick={onToggleRight}
              sx={{ color: rightOpen ? '#7c3aed' : 'var(--ux-text-muted)', transition: 'color 0.2s' }}>
              <ViewSidebarOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}

        {/* Info button */}
        {onShowInfo && (
          <Tooltip title="Photo Information" arrow>
            <IconButton size="small" onClick={onShowInfo} sx={{ color: 'var(--ux-text-secondary)', '&:hover': { color: '#06b6d4' } }}>
              <InfoOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}

        {/* Export button — hidden on mobile (bottom bar has it) */}
        {!isMobile && (
          <Button
            ref={exportBtnRef} variant="contained" onClick={onExport}
            onMouseEnter={handleExportHover} onMouseLeave={handleExportLeave}
            startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 14 }} />}
            sx={{ fontSize: '0.72rem', px: 2, py: 0.6 }}
          >
            Export
          </Button>
        )}
      </Box>

      {/* Bottom glow line */}
      <Box ref={glowLineRef} sx={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.4), rgba(6,182,212,0.3), transparent)',
        transformOrigin: 'center',
      }} />
    </Box>
  );
};

export default Header;
