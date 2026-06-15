import React, { useState } from 'react';
import { Box, Typography, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { PRESETS, type Preset } from '../utils/presets';
import type { Adjustments } from '../types/adjustments';

interface PresetsPanelProps {
  onApplyPreset: (presetAdj: Partial<Adjustments>) => void;
  activePresetId?: string; // We don't strictly track active preset yet, but good for future
}

const PresetsPanel: React.FC<PresetsPanelProps> = ({ onApplyPreset }) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Cinematic': true,
    'Film': true,
  });

  const categories = Array.from(new Set(PRESETS.map(p => p.category)));

  const handleToggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1, py: 1 }}>
      {categories.map(category => {
        const categoryPresets = PRESETS.filter(p => p.category === category);
        const isExpanded = !!expandedCategories[category];

        return (
          <Accordion
            key={category}
            expanded={isExpanded}
            onChange={() => handleToggleCategory(category)}
            disableGutters
            sx={{
              background: 'transparent',
              boxShadow: 'none',
              '&:before': { display: 'none' },
              mb: 0.5,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ fontSize: 16, color: 'var(--ux-text-muted)' }} />}
              sx={{
                minHeight: 32,
                px: 1,
                '& .MuiAccordionSummary-content': { my: 0.5 },
                '&:hover': { background: 'rgba(255,255,255,0.02)', borderRadius: 1 }
              }}
            >
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ux-text-primary)' }}>
                {category}
              </Typography>
              <Typography sx={{ ml: 'auto', mr: 1, fontSize: '0.65rem', color: 'var(--ux-text-muted)' }}>
                {categoryPresets.length}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0, px: 0.5, pb: 1 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.8 }}>
                {categoryPresets.map((preset: Preset) => (
                  <Button
                    key={preset.id}
                    variant="outlined"
                    onClick={() => onApplyPreset(preset.adjustments)}
                    startIcon={<AutoFixHighIcon sx={{ fontSize: '14px !important', opacity: 0.5 }} />}
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      fontSize: '0.65rem',
                      py: 0.8, px: 1,
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'var(--ux-text-secondary)',
                      background: 'rgba(255,255,255,0.02)',
                      '&:hover': {
                        background: 'rgba(124, 58, 237, 0.1)',
                        borderColor: 'rgba(124, 58, 237, 0.4)',
                        color: 'white'
                      }
                    }}
                  >
                    <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {preset.name}
                    </Box>
                  </Button>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default PresetsPanel;
