import React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'; // Using as Clone Stamp
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import type { ToolState, ToolType } from '../types/tools';
import BrushPanel from './BrushPanel';

interface ToolbarProps {
  toolState: ToolState;
  setToolState: React.Dispatch<React.SetStateAction<ToolState>>;
}

const Toolbar: React.FC<ToolbarProps> = ({ toolState, setToolState }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleToolSelect = (tool: ToolType) => {
    setToolState(prev => ({ ...prev, activeTool: tool }));
  };

  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const tools: { id: ToolType; icon: React.ReactNode; tooltip: string }[] = [
    { id: 'hand', icon: <PanToolOutlinedIcon fontSize="small" />, tooltip: 'Hand Tool (Pan & Zoom)' },
    { id: 'brush', icon: <BrushOutlinedIcon fontSize="small" />, tooltip: 'Brush Tool (Paint Mask)' },
    { id: 'clone', icon: <ContentCopyOutlinedIcon fontSize="small" />, tooltip: 'Clone Stamp (Alt+Click to set source)' },
  ];

  return (
    <Box
      sx={{
        width: 50,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        gap: 2,
        background: 'rgba(10, 10, 18, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.04)',
        zIndex: 10,
      }}
    >
      {tools.map(t => (
        <Tooltip key={t.id} title={t.tooltip} placement="right">
          <IconButton
            onClick={() => handleToolSelect(t.id)}
            sx={{
              color: toolState.activeTool === t.id ? '#06b6d4' : 'rgba(255,255,255,0.5)',
              bgcolor: toolState.activeTool === t.id ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              borderRadius: 2
            }}
          >
            {t.icon}
          </IconButton>
        </Tooltip>
      ))}

      <Box sx={{ flexGrow: 1 }} />

      {(toolState.activeTool === 'brush' || toolState.activeTool === 'clone') && (
        <>
          <Tooltip title="Brush Settings" placement="right">
            <IconButton
              onClick={handleSettingsClick}
              sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }, borderRadius: 2 }}
            >
              <SettingsOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <BrushPanel 
            toolState={toolState} 
            setToolState={setToolState} 
            anchorEl={anchorEl} 
            onClose={handleClose} 
          />
        </>
      )}
    </Box>
  );
};

export default Toolbar;
