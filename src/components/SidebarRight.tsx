import React, { useRef, useCallback, useState } from 'react';
import { Box, Typography, Slider, IconButton, Tooltip, Button } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import DeblurOutlinedIcon from '@mui/icons-material/DeblurOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import TonalityOutlinedIcon from '@mui/icons-material/TonalityOutlined';
import CropOutlinedIcon from '@mui/icons-material/CropOutlined';
import FlipOutlinedIcon from '@mui/icons-material/FlipOutlined';
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SyncIcon from '@mui/icons-material/Sync';
import TuneIcon from '@mui/icons-material/Tune';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import gsap from 'gsap';
import {
  type Adjustments, type SliderDef, countActive,
  LIGHT_SLIDERS, COLOR_SLIDERS, DETAIL_SLIDERS, EFFECTS_SLIDERS,
  type ColorMixChannel, COLOR_MIX_CHANNELS,
  type ColorGradingRange, COLOR_GRADING_RANGES
} from '../types/adjustments';
import PresetsPanel from './PresetsPanel';

/* ─── Single Slider ─── */

interface AdjSliderProps {
  def: SliderDef;
  value: number;
  onChange: (key: keyof Adjustments, val: number) => void;
}

const AdjSlider: React.FC<AdjSliderProps> = React.memo(({ def, value, onChange }) => {
  const resetRef = useRef<HTMLButtonElement>(null);

  const handleReset = () => {
    onChange(def.key, 0);
    if (resetRef.current) {
      gsap.fromTo(resetRef.current, { rotation: 0 }, { rotation: 360, duration: 0.5, ease: 'power2.out' });
    }
  };

  return (
    <Box sx={{ px: 1.5, py: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.2 }}>
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 450, color: 'var(--ux-text-secondary)' }}>
          {def.label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
          <Typography
            sx={{
              fontSize: '0.65rem', fontWeight: 600, minWidth: 24, textAlign: 'right',
              fontVariantNumeric: 'tabular-nums', transition: 'color 0.2s',
              color: value !== 0 ? '#7c3aed' : 'var(--ux-text-muted)',
            }}
          >
            {value > 0 ? '+' : ''}{value}
          </Typography>
          {value !== 0 && (
            <Tooltip title="Reset" arrow>
              <IconButton ref={resetRef} size="small" onClick={handleReset}
                sx={{ width: 18, height: 18, color: 'var(--ux-text-muted)', '&:hover': { color: '#7c3aed' } }}>
                <RestartAltIcon sx={{ fontSize: 12 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      <Slider
        value={value} min={def.min} max={def.max}
        onChange={(_, v) => onChange(def.key, v as number)}
        valueLabelDisplay="auto" size="small"
        sx={{ mx: 0.3, py: '8px !important' }}
      />
    </Box>
  );
});

AdjSlider.displayName = 'AdjSlider';

/* ─── Collapsible Group ─── */

interface GroupProps {
  title: string;
  icon: React.ReactNode;
  activeCount: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const AccordionGroup: React.FC<GroupProps> = ({ title, icon, activeCount, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => {
    const el = contentRef.current;
    if (!el) { setOpen(!open); return; }

    if (open) {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.inOut', onComplete: () => setOpen(false) });
    } else {
      setOpen(true);
      requestAnimationFrame(() => {
        gsap.fromTo(el, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out' });
      });
    }
  }, [open]);

  return (
    <Box>
      {/* Group Header */}
      <Box
        onClick={toggle}
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 1.5, py: 1, cursor: 'pointer', userSelect: 'none',
          transition: 'background 0.2s',
          '&:hover': { background: 'rgba(255,255,255,0.02)' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Box sx={{ color: 'var(--ux-text-muted)', display: 'flex', alignItems: 'center' }}>
            {icon}
          </Box>
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--ux-text-primary)', letterSpacing: '0.01em' }}>
            {title}
          </Typography>
          {activeCount > 0 && (
            <Box
              sx={{
                minWidth: 16, height: 16, borderRadius: '100px',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                px: 0.5,
              }}
            >
              <Typography sx={{ fontSize: '0.55rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                {activeCount}
              </Typography>
            </Box>
          )}
        </Box>
        {open ? (
          <ExpandLessIcon sx={{ fontSize: 16, color: 'var(--ux-text-muted)' }} />
        ) : (
          <ExpandMoreIcon sx={{ fontSize: 16, color: 'var(--ux-text-muted)' }} />
        )}
      </Box>

      {/* Group Content */}
      {open && (
        <Box ref={contentRef} sx={{ overflow: 'hidden', pb: 0.5 }}>
          {children}
        </Box>
      )}

      {/* Divider */}
      <Box sx={{ mx: 1.5, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)' }} />
    </Box>
  );
};

/* ─── Transform Section ─── */

interface TransformProps {
  adj: Adjustments;
  onChange: (key: keyof Adjustments, val: number | boolean) => void;
}

const TransformSection: React.FC<TransformProps> = ({ adj, onChange }) => {
  return (
    <>
      <Box sx={{ px: 1.5, py: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.2 }}>
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 450, color: 'var(--ux-text-secondary)' }}>
            Rotation
          </Typography>
          <Typography
            sx={{
              fontSize: '0.65rem', fontWeight: 600, minWidth: 24, textAlign: 'right',
              fontVariantNumeric: 'tabular-nums',
              color: adj.rotation !== 0 ? '#7c3aed' : 'var(--ux-text-muted)',
            }}
          >
            {adj.rotation}°
          </Typography>
        </Box>
        <Slider
          value={adj.rotation} min={-180} max={180}
          onChange={(_, v) => onChange('rotation', v as number)}
          valueLabelDisplay="auto" size="small"
          sx={{ mx: 0.3, py: '8px !important' }}
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 1, px: 1.5, pb: 1 }}>
        <Button
          size="small" variant={adj.flipH ? 'contained' : 'outlined'}
          onClick={() => onChange('flipH', !adj.flipH)}
          startIcon={<FlipOutlinedIcon sx={{ fontSize: 14 }} />}
          sx={{ flex: 1, fontSize: '0.65rem', py: 0.4, minWidth: 0 }}
        >
          Flip H
        </Button>
        <Button
          size="small" variant={adj.flipV ? 'contained' : 'outlined'}
          onClick={() => onChange('flipV', !adj.flipV)}
          startIcon={<FlipOutlinedIcon sx={{ fontSize: 14, transform: 'rotate(90deg)' }} />}
          sx={{ flex: 1, fontSize: '0.65rem', py: 0.4, minWidth: 0 }}
        >
          Flip V
        </Button>
      </Box>
    </>
  );
};

/* ─── Color Mix Section ─── */

const ColorMixSection: React.FC<{ adj: Adjustments, onChange: (k: keyof Adjustments, v: number) => void }> = ({ adj, onChange }) => {
  const [activeChannel, setActiveChannel] = useState<ColorMixChannel>('red');

  return (
    <Box sx={{ px: 1.5, pb: 1 }}>
      <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', mb: 2, justifyContent: 'center' }}>
        {COLOR_MIX_CHANNELS.map(ch => (
          <Box
            key={ch.id}
            onClick={() => setActiveChannel(ch.id)}
            sx={{
              width: 22, height: 22, borderRadius: '50%', cursor: 'pointer',
              bgcolor: ch.color, 
              border: activeChannel === ch.id ? '2px solid white' : '2px solid transparent',
              boxShadow: activeChannel === ch.id ? `0 0 10px ${ch.color}` : 'none',
              transition: 'all 0.2s ease',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          />
        ))}
      </Box>
      <AdjSlider def={{ key: `${activeChannel}Hue` as keyof Adjustments, label: 'Hue', min: -100, max: 100 }} value={adj[`${activeChannel}Hue` as keyof Adjustments] as number} onChange={onChange} />
      <AdjSlider def={{ key: `${activeChannel}Sat` as keyof Adjustments, label: 'Saturation', min: -100, max: 100 }} value={adj[`${activeChannel}Sat` as keyof Adjustments] as number} onChange={onChange} />
      <AdjSlider def={{ key: `${activeChannel}Lum` as keyof Adjustments, label: 'Luminance', min: -100, max: 100 }} value={adj[`${activeChannel}Lum` as keyof Adjustments] as number} onChange={onChange} />
    </Box>
  );
};

/* ─── Color Grading Section ─── */

const ColorGradingSection: React.FC<{ adj: Adjustments, onChange: (k: keyof Adjustments, v: number) => void }> = ({ adj, onChange }) => {
  const [activeRange, setActiveRange] = useState<ColorGradingRange>('shadows');

  return (
    <Box sx={{ px: 1.5, pb: 1 }}>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {COLOR_GRADING_RANGES.map(r => (
          <Button
            key={r.id} size="small"
            variant={activeRange === r.id ? 'contained' : 'outlined'}
            onClick={() => setActiveRange(r.id)}
            sx={{ flex: 1, fontSize: '0.65rem', minWidth: 0, py: 0.3 }}
          >
            {r.label}
          </Button>
        ))}
      </Box>
      <AdjSlider def={{ key: `${activeRange}Hue` as keyof Adjustments, label: 'Hue', min: 0, max: 360, positiveOnly: true }} value={adj[`${activeRange}Hue` as keyof Adjustments] as number} onChange={onChange} />
      <AdjSlider def={{ key: `${activeRange}Sat` as keyof Adjustments, label: 'Saturation', min: 0, max: 100, positiveOnly: true }} value={adj[`${activeRange}Sat` as keyof Adjustments] as number} onChange={onChange} />
    </Box>
  );
};

/* ─── Main SidebarRight ─── */

interface SidebarRightProps {
  adjustments: Adjustments;
  onAdjustmentChange: (key: keyof Adjustments, val: number | boolean) => void;
  onResetAll: () => void;
  onAutoEnhance?: () => void;
  onSyncToAll?: () => void;
  onApplyPreset?: (presetAdj: Partial<Adjustments>) => void;
}

const SidebarRight: React.FC<SidebarRightProps> = ({ adjustments, onAdjustmentChange, onResetAll, onAutoEnhance, onSyncToAll, onApplyPreset }) => {
  const [activeTab, setActiveTab] = useState<'adjust' | 'presets'>('adjust');
  const adj = adjustments;

  const handleSliderChange = useCallback((key: keyof Adjustments, val: number) => {
    onAdjustmentChange(key, val);
  }, [onAdjustmentChange]);

  const lightKeys = LIGHT_SLIDERS.map(s => s.key);
  const colorKeys = COLOR_SLIDERS.map(s => s.key);
  const detailKeys = DETAIL_SLIDERS.map(s => s.key);
  const effectKeys = EFFECTS_SLIDERS.map(s => s.key);
  const transformKeys: (keyof Adjustments)[] = ['rotation', 'flipH', 'flipV'];
  const colorMixKeys: (keyof Adjustments)[] = COLOR_MIX_CHANNELS.flatMap(c => [`${c.id}Hue` as keyof Adjustments, `${c.id}Sat` as keyof Adjustments, `${c.id}Lum` as keyof Adjustments]);
  const colorGradingKeys: (keyof Adjustments)[] = COLOR_GRADING_RANGES.flatMap(r => [`${r.id}Hue` as keyof Adjustments, `${r.id}Sat` as keyof Adjustments]);

  const totalActive = countActive(adj, [...lightKeys, ...colorKeys, ...colorMixKeys, ...colorGradingKeys, ...detailKeys, ...effectKeys, ...transformKeys]);

  return (
    <Box
      sx={{
        width: { xs: '100%', sm: '100%', md: 260, lg: 280 },
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(10, 10, 18, 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderLeft: { xs: 'none', md: '1px solid rgba(255,255,255,0.04)' },
        overflowY: 'auto',
        height: '100%',
      }}
    >
      {/* Header Tabs */}
      <Box sx={{ px: 1.5, pt: 1.5, pb: 1, display: 'flex', gap: 0.5 }}>
        <Button
          fullWidth size="small"
          onClick={() => setActiveTab('adjust')}
          variant={activeTab === 'adjust' ? 'contained' : 'text'}
          startIcon={<TuneIcon sx={{ fontSize: 16 }} />}
          sx={{
            fontSize: '0.65rem', py: 0.5,
            bgcolor: activeTab === 'adjust' ? 'rgba(255,255,255,0.1)' : 'transparent',
            color: activeTab === 'adjust' ? 'white' : 'var(--ux-text-muted)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' }
          }}
        >
          Adjust
        </Button>
        <Button
          fullWidth size="small"
          onClick={() => setActiveTab('presets')}
          variant={activeTab === 'presets' ? 'contained' : 'text'}
          startIcon={<AutoFixHighIcon sx={{ fontSize: 16 }} />}
          sx={{
            fontSize: '0.65rem', py: 0.5,
            bgcolor: activeTab === 'presets' ? 'rgba(255,255,255,0.1)' : 'transparent',
            color: activeTab === 'presets' ? 'white' : 'var(--ux-text-muted)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' }
          }}
        >
          Presets
        </Button>
      </Box>

      {/* Preset View */}
      {activeTab === 'presets' && onApplyPreset && (
        <PresetsPanel onApplyPreset={onApplyPreset} />
      )}

      {/* Adjust View */}
      {activeTab === 'adjust' && (
        <>
          <Box sx={{ px: 1.5, pt: 0.5, pb: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', color: 'var(--ux-text-muted)', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.12em' }}>
              Develop
            </Typography>
            {totalActive > 0 && (
              <Typography sx={{ fontSize: '0.58rem', color: 'var(--ux-text-muted)' }}>
                {totalActive} active
              </Typography>
            )}
          </Box>

      {/* Auto Enhance Button */}
      {onAutoEnhance && (
        <Box sx={{ px: 1.5, pb: 1 }}>
          <Button
            variant="contained"
            fullWidth
            size="small"
            onClick={onAutoEnhance}
            startIcon={<AutoAwesomeOutlinedIcon sx={{ fontSize: 14 }} />}
            sx={{
              fontSize: '0.68rem', py: 0.5,
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(124, 58, 237, 0.4)',
              }
            }}
          >
            Auto Enhance
          </Button>
        </Box>
      )}

      {/* ─── Light ─── */}
      <AccordionGroup
        title="Light"
        icon={<WbSunnyOutlinedIcon sx={{ fontSize: 15 }} />}
        activeCount={countActive(adj, lightKeys)}
        defaultOpen={true}
      >
        {LIGHT_SLIDERS.map((s) => (
          <AdjSlider key={s.key} def={s} value={adj[s.key] as number} onChange={handleSliderChange} />
        ))}
      </AccordionGroup>

      {/* ─── Color ─── */}
      <AccordionGroup
        title="Color"
        icon={<ColorLensOutlinedIcon sx={{ fontSize: 15 }} />}
        activeCount={countActive(adj, colorKeys)}
        defaultOpen={false}
      >
        {COLOR_SLIDERS.map((s) => (
          <AdjSlider key={s.key} def={s} value={adj[s.key] as number} onChange={handleSliderChange} />
        ))}
      </AccordionGroup>

      {/* ─── Color Mix ─── */}
      <AccordionGroup
        title="Color Mix"
        icon={<PaletteOutlinedIcon sx={{ fontSize: 15 }} />}
        activeCount={countActive(adj, colorMixKeys)}
        defaultOpen={false}
      >
        <ColorMixSection adj={adj} onChange={handleSliderChange} />
      </AccordionGroup>

      {/* ─── Color Grading ─── */}
      <AccordionGroup
        title="Color Grading"
        icon={<TonalityOutlinedIcon sx={{ fontSize: 15 }} />}
        activeCount={countActive(adj, colorGradingKeys)}
        defaultOpen={false}
      >
        <ColorGradingSection adj={adj} onChange={handleSliderChange} />
      </AccordionGroup>

      {/* ─── Detail ─── */}
      <AccordionGroup
        title="Detail"
        icon={<DeblurOutlinedIcon sx={{ fontSize: 15 }} />}
        activeCount={countActive(adj, detailKeys)}
        defaultOpen={false}
      >
        {DETAIL_SLIDERS.map((s) => (
          <AdjSlider key={s.key} def={s} value={adj[s.key] as number} onChange={handleSliderChange} />
        ))}
      </AccordionGroup>

      {/* ─── Effects ─── */}
      <AccordionGroup
        title="Effects"
        icon={<AutoAwesomeOutlinedIcon sx={{ fontSize: 15 }} />}
        activeCount={countActive(adj, effectKeys)}
        defaultOpen={false}
      >
        {EFFECTS_SLIDERS.map((s) => (
          <AdjSlider key={s.key} def={s} value={adj[s.key] as number} onChange={handleSliderChange} />
        ))}
      </AccordionGroup>

      {/* ─── Transform ─── */}
      <AccordionGroup
        title="Transform"
        icon={<CropOutlinedIcon sx={{ fontSize: 15 }} />}
        activeCount={countActive(adj, transformKeys)}
        defaultOpen={false}
      >
        <TransformSection adj={adj} onChange={onAdjustmentChange} />
      </AccordionGroup>

      {/* ─── Actions ─── */}
      <Box sx={{ px: 1.5, py: 1.5, mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {onSyncToAll && (
          <Button
            variant="contained"
            fullWidth
            size="small"
            onClick={onSyncToAll}
            startIcon={<SyncIcon sx={{ fontSize: 14 }} />}
            sx={{ fontSize: '0.68rem', py: 0.6, bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}
          >
            Sync to All
          </Button>
        )}
        <Button
          variant="outlined"
          fullWidth
          size="small"
          onClick={onResetAll}
          startIcon={<RotateLeftOutlinedIcon sx={{ fontSize: 14 }} />}
          disabled={totalActive === 0}
          sx={{ fontSize: '0.68rem', py: 0.6 }}
        >
          Reset All
        </Button>
      </Box>

      {/* Footer */}
      <Box sx={{ px: 1.5, pb: 1.5 }}>
        <Typography sx={{ fontSize: '0.55rem', color: 'var(--ux-text-muted)', lineHeight: 1.4 }}>
          All adjustments are non-destructive. Export to apply.
        </Typography>
      </Box>
        </>
      )}
    </Box>
  );
};

export default SidebarRight;
