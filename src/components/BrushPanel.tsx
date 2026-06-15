import React, { useState } from 'react';
import { Box, Typography, Slider, Grid, Tabs, Tab, Popover } from '@mui/material';
import type { ToolState } from '../types/tools';
import { BRUSHES, type BrushPreset } from '../utils/brushes';

interface BrushPanelProps {
  toolState: ToolState;
  setToolState: React.Dispatch<React.SetStateAction<ToolState>>;
  anchorEl?: HTMLButtonElement | null;
  onClose?: () => void;
  isMobile?: boolean;
}

const BrushPanel: React.FC<BrushPanelProps> = ({ toolState, setToolState, anchorEl, onClose, isMobile }) => {
  const [tab, setTab] = useState(0);

  const handleBrushSelect = (brush: BrushPreset) => {
    setToolState(p => ({
      ...p,
      brushId: brush.id,
      brushSize: brush.defaultSize,
      brushHardness: brush.hardness,
      brushOpacity: brush.defaultOpacity,
      brushSpacing: brush.spacing,
      brushBlendMode: brush.blendMode
    }));
  };

  const categories = Array.from(new Set(BRUSHES.map(b => b.category)));

  const content = (
    <>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="fullWidth"
        sx={{
          minHeight: 40,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          '& .MuiTab-root': { minHeight: 40, color: 'rgba(255,255,255,0.5)', textTransform: 'none' },
          '& .Mui-selected': { color: '#06b6d4' },
          '& .MuiTabs-indicator': { backgroundColor: '#06b6d4' }
        }}
      >
        <Tab label="Settings" />
        <Tab label="Brushes" />
      </Tabs>

      <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto' }}>
        {tab === 0 && (
          <Box>
            {/* Color Picker (Simple Hex for now) */}
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, display: 'block' }}>Color</Typography>
            <input 
              type="color" 
              value={toolState.brushColor} 
              onChange={(e) => setToolState(p => ({...p, brushColor: e.target.value}))}
              style={{ width: '100%', height: '40px', border: 'none', borderRadius: '4px', background: 'transparent', cursor: 'pointer', marginBottom: '16px' }}
            />

            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, display: 'block' }}>Size ({toolState.brushSize}px)</Typography>
            <Slider
              size="small" min={1} max={500} value={toolState.brushSize}
              onChange={(_, v) => setToolState(p => ({ ...p, brushSize: v as number }))}
              sx={{ mb: 2, color: '#06b6d4' }}
            />
            
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, display: 'block' }}>Hardness ({toolState.brushHardness}%)</Typography>
            <Slider
              size="small" min={0} max={100} value={toolState.brushHardness}
              onChange={(_, v) => setToolState(p => ({ ...p, brushHardness: v as number }))}
              sx={{ mb: 2, color: '#06b6d4' }}
            />

            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, display: 'block' }}>Opacity ({toolState.brushOpacity}%)</Typography>
            <Slider
              size="small" min={1} max={100} value={toolState.brushOpacity}
              onChange={(_, v) => setToolState(p => ({ ...p, brushOpacity: v as number }))}
              sx={{ color: '#06b6d4' }}
            />
          </Box>
        )}

        {tab === 1 && (
          <Box>
            {categories.map(cat => (
              <Box key={cat} sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>{cat}</Typography>
                <Grid container spacing={1}>
                  {BRUSHES.filter(b => b.category === cat).map(brush => (
                    <Grid size={{ xs: 6 }} key={brush.id}>
                      <Box
                        onClick={() => handleBrushSelect(brush)}
                        sx={{
                          p: 1,
                          cursor: 'pointer',
                          borderRadius: 1,
                          bgcolor: toolState.brushId === brush.id ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${toolState.brushId === brush.id ? '#06b6d4' : 'transparent'}`,
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                          transition: 'all 0.2s'
                        }}
                      >
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: toolState.brushId === brush.id ? 600 : 400 }}>{brush.name}</Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{brush.type}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </>
  );

  if (isMobile) {
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', color: 'white' }}>
        {content}
      </Box>
    );
  }

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
      transformOrigin={{ vertical: 'center', horizontal: 'left' }}
      sx={{
        '& .MuiPaper-root': {
          bgcolor: 'rgba(20,20,25,0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'white',
          width: 320,
          ml: 1,
          height: 400,
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      {content}
    </Popover>
  );
};

export default BrushPanel;
