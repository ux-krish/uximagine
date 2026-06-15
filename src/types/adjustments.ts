export interface Adjustments {
  // Light
  exposure: number;
  contrast: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;

  // Color
  temperature: number;
  tint: number;
  vibrance: number;
  saturation: number;

  // Detail
  sharpness: number;
  noiseReduction: number;
  luminance: number;

  // Effects
  clarity: number;
  dehaze: number;
  vignette: number;
  grain: number;

  // Transform
  rotation: number;
  flipH: boolean;
  flipV: boolean;

  // Color Mix (HSL per channel)
  redHue: number; redSat: number; redLum: number;
  orangeHue: number; orangeSat: number; orangeLum: number;
  yellowHue: number; yellowSat: number; yellowLum: number;
  greenHue: number; greenSat: number; greenLum: number;
  aquaHue: number; aquaSat: number; aquaLum: number;
  blueHue: number; blueSat: number; blueLum: number;
  purpleHue: number; purpleSat: number; purpleLum: number;
  magentaHue: number; magentaSat: number; magentaLum: number;

  // Color Grading
  shadowsHue: number; shadowsSat: number;
  midtonesHue: number; midtonesSat: number;
  highlightsHue: number; highlightsSat: number;
}

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  temperature: 0,
  tint: 0,
  vibrance: 0,
  saturation: 0,
  sharpness: 0,
  noiseReduction: 0,
  luminance: 0,
  clarity: 0,
  dehaze: 0,
  vignette: 0,
  grain: 0,
  rotation: 0,
  flipH: false,
  flipV: false,

  redHue: 0, redSat: 0, redLum: 0,
  orangeHue: 0, orangeSat: 0, orangeLum: 0,
  yellowHue: 0, yellowSat: 0, yellowLum: 0,
  greenHue: 0, greenSat: 0, greenLum: 0,
  aquaHue: 0, aquaSat: 0, aquaLum: 0,
  blueHue: 0, blueSat: 0, blueLum: 0,
  purpleHue: 0, purpleSat: 0, purpleLum: 0,
  magentaHue: 0, magentaSat: 0, magentaLum: 0,

  shadowsHue: 0, shadowsSat: 0,
  midtonesHue: 0, midtonesSat: 0,
  highlightsHue: 0, highlightsSat: 0,
};

/** Returns count of non-default numeric sliders in a group */
export function countActive(adj: Adjustments, keys: (keyof Adjustments)[]): number {
  return keys.filter((k) => {
    const v = adj[k];
    if (typeof v === 'boolean') return v !== false;
    return v !== 0;
  }).length;
}

/** Slider definition for declarative rendering */
export interface SliderDef {
  key: keyof Adjustments;
  label: string;
  min: number;
  max: number;
  /** If true, the slider only goes 0..max (no negatives) */
  positiveOnly?: boolean;
}

export const LIGHT_SLIDERS: SliderDef[] = [
  { key: 'exposure', label: 'Exposure', min: -100, max: 100 },
  { key: 'contrast', label: 'Contrast', min: -100, max: 100 },
  { key: 'highlights', label: 'Highlights', min: -100, max: 100 },
  { key: 'shadows', label: 'Shadows', min: -100, max: 100 },
  { key: 'whites', label: 'Whites', min: -100, max: 100 },
  { key: 'blacks', label: 'Blacks', min: -100, max: 100 },
];

export const COLOR_SLIDERS: SliderDef[] = [
  { key: 'temperature', label: 'Temperature', min: -100, max: 100 },
  { key: 'tint', label: 'Tint', min: -100, max: 100 },
  { key: 'vibrance', label: 'Vibrance', min: -100, max: 100 },
  { key: 'saturation', label: 'Saturation', min: -100, max: 100 },
];

export const DETAIL_SLIDERS: SliderDef[] = [
  { key: 'sharpness', label: 'Sharpness', min: 0, max: 100, positiveOnly: true },
  { key: 'noiseReduction', label: 'Noise Reduction', min: 0, max: 100, positiveOnly: true },
  { key: 'luminance', label: 'Luminance', min: 0, max: 100, positiveOnly: true },
];

export const EFFECTS_SLIDERS: SliderDef[] = [
  { key: 'clarity', label: 'Clarity', min: -100, max: 100 },
  { key: 'dehaze', label: 'Dehaze', min: -100, max: 100 },
  { key: 'vignette', label: 'Vignette', min: -100, max: 100 },
  { key: 'grain', label: 'Grain', min: 0, max: 100, positiveOnly: true },
];

export type ColorMixChannel = 'red' | 'orange' | 'yellow' | 'green' | 'aqua' | 'blue' | 'purple' | 'magenta';
export const COLOR_MIX_CHANNELS: { id: ColorMixChannel, label: string, color: string }[] = [
  { id: 'red', label: 'Red', color: '#ef4444' },
  { id: 'orange', label: 'Orange', color: '#f97316' },
  { id: 'yellow', label: 'Yellow', color: '#eab308' },
  { id: 'green', label: 'Green', color: '#22c55e' },
  { id: 'aqua', label: 'Aqua', color: '#06b6d4' },
  { id: 'blue', label: 'Blue', color: '#3b82f6' },
  { id: 'purple', label: 'Purple', color: '#8b5cf6' },
  { id: 'magenta', label: 'Magenta', color: '#d946ef' },
];

export type ColorGradingRange = 'shadows' | 'midtones' | 'highlights';
export const COLOR_GRADING_RANGES: { id: ColorGradingRange, label: string }[] = [
  { id: 'shadows', label: 'Shadows' },
  { id: 'midtones', label: 'Midtones' },
  { id: 'highlights', label: 'Highlights' },
];
