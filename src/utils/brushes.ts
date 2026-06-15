export type BrushType = 'solid' | 'soft' | 'airbrush' | 'pencil' | 'chalk' | 'marker' | 'texture' | 'watercolor';
export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'color';

export interface BrushPreset {
  id: string;
  name: string;
  category: string;
  type: BrushType;
  defaultSize: number;
  defaultOpacity: number;
  hardness: number;
  spacing: number;
  blendMode: BlendMode;
  textureId?: string; // We can use SVG filters or custom math for texture
}

export const BRUSHES: BrushPreset[] = [
  // --- BASIC (Inking / Round) ---
  { id: 'b-hard-round', name: 'Hard Round', category: 'Basic', type: 'solid', defaultSize: 20, defaultOpacity: 100, hardness: 100, spacing: 5, blendMode: 'normal' },
  { id: 'b-soft-round', name: 'Soft Round', category: 'Basic', type: 'soft', defaultSize: 80, defaultOpacity: 80, hardness: 0, spacing: 10, blendMode: 'normal' },
  { id: 'b-airbrush', name: 'Airbrush Low Flow', category: 'Basic', type: 'airbrush', defaultSize: 150, defaultOpacity: 30, hardness: 0, spacing: 5, blendMode: 'normal' },
  { id: 'b-studio-pen', name: 'Studio Pen', category: 'Basic', type: 'solid', defaultSize: 10, defaultOpacity: 100, hardness: 95, spacing: 2, blendMode: 'normal' },
  { id: 'b-technical-pen', name: 'Technical Pen', category: 'Basic', type: 'solid', defaultSize: 4, defaultOpacity: 100, hardness: 100, spacing: 1, blendMode: 'normal' },
  { id: 'b-fountain-pen', name: 'Fountain Pen', category: 'Basic', type: 'solid', defaultSize: 8, defaultOpacity: 100, hardness: 90, spacing: 2, blendMode: 'multiply' },
  { id: 'b-calligraphy', name: 'Calligraphy Script', category: 'Basic', type: 'solid', defaultSize: 15, defaultOpacity: 100, hardness: 100, spacing: 2, blendMode: 'normal' },
  { id: 'b-fine-liner', name: 'Fine Liner 0.5', category: 'Basic', type: 'solid', defaultSize: 2, defaultOpacity: 100, hardness: 100, spacing: 1, blendMode: 'multiply' },

  // --- SKETCHING (Pencil / Charcoal / Chalk) ---
  { id: 's-hb-pencil', name: 'HB Pencil', category: 'Sketching', type: 'pencil', defaultSize: 4, defaultOpacity: 60, hardness: 80, spacing: 2, blendMode: 'multiply' },
  { id: 's-6b-pencil', name: '6B Soft Pencil', category: 'Sketching', type: 'pencil', defaultSize: 8, defaultOpacity: 80, hardness: 50, spacing: 5, blendMode: 'multiply' },
  { id: 's-charcoal-block', name: 'Charcoal Block', category: 'Sketching', type: 'chalk', defaultSize: 30, defaultOpacity: 90, hardness: 30, spacing: 15, blendMode: 'multiply' },
  { id: 's-willow-charcoal', name: 'Willow Charcoal', category: 'Sketching', type: 'chalk', defaultSize: 15, defaultOpacity: 70, hardness: 40, spacing: 10, blendMode: 'multiply' },
  { id: 's-soft-pastel', name: 'Soft Pastel', category: 'Sketching', type: 'chalk', defaultSize: 25, defaultOpacity: 85, hardness: 20, spacing: 15, blendMode: 'normal' },
  { id: 's-oil-pastel', name: 'Oil Pastel', category: 'Sketching', type: 'chalk', defaultSize: 20, defaultOpacity: 100, hardness: 60, spacing: 8, blendMode: 'normal' },
  { id: 's-chalk-dust', name: 'Chalk Dust', category: 'Sketching', type: 'texture', defaultSize: 40, defaultOpacity: 50, hardness: 10, spacing: 20, blendMode: 'normal' },
  { id: 's-rough-sketch', name: 'Rough Sketcher', category: 'Sketching', type: 'pencil', defaultSize: 6, defaultOpacity: 50, hardness: 60, spacing: 10, blendMode: 'multiply' },

  // --- PAINTING (Oils / Acrylics) ---
  { id: 'p-flat-brush', name: 'Flat Brush', category: 'Painting', type: 'solid', defaultSize: 40, defaultOpacity: 90, hardness: 80, spacing: 5, blendMode: 'normal' },
  { id: 'p-round-bristle', name: 'Round Bristle', category: 'Painting', type: 'texture', defaultSize: 35, defaultOpacity: 85, hardness: 50, spacing: 10, blendMode: 'normal' },
  { id: 'p-acrylic-thick', name: 'Thick Acrylic', category: 'Painting', type: 'texture', defaultSize: 50, defaultOpacity: 100, hardness: 70, spacing: 5, blendMode: 'normal' },
  { id: 'p-oil-blend', name: 'Oil Blender', category: 'Painting', type: 'soft', defaultSize: 60, defaultOpacity: 40, hardness: 10, spacing: 8, blendMode: 'normal' },
  { id: 'p-dry-brush', name: 'Dry Brush', category: 'Painting', type: 'texture', defaultSize: 45, defaultOpacity: 70, hardness: 60, spacing: 15, blendMode: 'normal' },
  { id: 'p-gouache', name: 'Gouache Wash', category: 'Painting', type: 'solid', defaultSize: 55, defaultOpacity: 80, hardness: 40, spacing: 5, blendMode: 'normal' },
  { id: 'p-palette-knife', name: 'Palette Knife', category: 'Painting', type: 'texture', defaultSize: 30, defaultOpacity: 100, hardness: 90, spacing: 2, blendMode: 'normal' },
  { id: 'p-wet-acrylic', name: 'Wet Acrylic', category: 'Painting', type: 'soft', defaultSize: 45, defaultOpacity: 75, hardness: 30, spacing: 8, blendMode: 'normal' },

  // --- WATERCOLOR & INK ---
  { id: 'w-water-bleed', name: 'Watercolor Bleed', category: 'Watercolor', type: 'watercolor', defaultSize: 80, defaultOpacity: 40, hardness: 0, spacing: 10, blendMode: 'multiply' },
  { id: 'w-wash', name: 'Soft Wash', category: 'Watercolor', type: 'watercolor', defaultSize: 120, defaultOpacity: 30, hardness: 0, spacing: 15, blendMode: 'multiply' },
  { id: 'w-ink-drop', name: 'Ink Drop', category: 'Watercolor', type: 'watercolor', defaultSize: 20, defaultOpacity: 80, hardness: 20, spacing: 5, blendMode: 'multiply' },
  { id: 'w-chinese-brush', name: 'Chinese Brush', category: 'Watercolor', type: 'watercolor', defaultSize: 30, defaultOpacity: 85, hardness: 40, spacing: 5, blendMode: 'multiply' },
  { id: 'w-wet-sponge', name: 'Wet Sponge', category: 'Watercolor', type: 'texture', defaultSize: 100, defaultOpacity: 50, hardness: 10, spacing: 25, blendMode: 'multiply' },
  { id: 'w-diluted-ink', name: 'Diluted Ink', category: 'Watercolor', type: 'watercolor', defaultSize: 40, defaultOpacity: 45, hardness: 15, spacing: 10, blendMode: 'multiply' },
  { id: 'w-heavy-wash', name: 'Heavy Wash', category: 'Watercolor', type: 'watercolor', defaultSize: 90, defaultOpacity: 65, hardness: 10, spacing: 10, blendMode: 'multiply' },
  { id: 'w-detail-water', name: 'Water Detail', category: 'Watercolor', type: 'watercolor', defaultSize: 15, defaultOpacity: 70, hardness: 30, spacing: 5, blendMode: 'multiply' },

  // --- MARKERS ---
  { id: 'm-copic-broad', name: 'Broad Marker', category: 'Marker', type: 'marker', defaultSize: 40, defaultOpacity: 60, hardness: 80, spacing: 5, blendMode: 'multiply' },
  { id: 'm-copic-fine', name: 'Fine Marker', category: 'Marker', type: 'marker', defaultSize: 10, defaultOpacity: 80, hardness: 90, spacing: 2, blendMode: 'multiply' },
  { id: 'm-highlighter', name: 'Highlighter', category: 'Marker', type: 'marker', defaultSize: 30, defaultOpacity: 50, hardness: 85, spacing: 5, blendMode: 'multiply' },
  { id: 'm-sharpie', name: 'Permanent Marker', category: 'Marker', type: 'marker', defaultSize: 12, defaultOpacity: 95, hardness: 100, spacing: 2, blendMode: 'multiply' },
  { id: 'm-dry-erase', name: 'Dry Erase', category: 'Marker', type: 'marker', defaultSize: 25, defaultOpacity: 80, hardness: 75, spacing: 5, blendMode: 'normal' },
  { id: 'm-chisel-tip', name: 'Chisel Tip', category: 'Marker', type: 'marker', defaultSize: 35, defaultOpacity: 70, hardness: 80, spacing: 5, blendMode: 'multiply' },
  { id: 'm-alcohol-blend', name: 'Alcohol Blender', category: 'Marker', type: 'marker', defaultSize: 45, defaultOpacity: 40, hardness: 20, spacing: 10, blendMode: 'multiply' },

  // --- FX & TEXTURE ---
  { id: 'fx-splatter', name: 'Paint Splatter', category: 'FX', type: 'texture', defaultSize: 80, defaultOpacity: 100, hardness: 100, spacing: 50, blendMode: 'normal' },
  { id: 'fx-halftone', name: 'Comic Halftone', category: 'FX', type: 'texture', defaultSize: 100, defaultOpacity: 90, hardness: 100, spacing: 30, blendMode: 'multiply' },
  { id: 'fx-grunge', name: 'Grunge Texture', category: 'FX', type: 'texture', defaultSize: 150, defaultOpacity: 60, hardness: 20, spacing: 40, blendMode: 'multiply' },
  { id: 'fx-cloud', name: 'Soft Clouds', category: 'FX', type: 'texture', defaultSize: 200, defaultOpacity: 40, hardness: 0, spacing: 25, blendMode: 'screen' },
  { id: 'fx-sparkle', name: 'Magic Sparkles', category: 'FX', type: 'texture', defaultSize: 60, defaultOpacity: 100, hardness: 80, spacing: 60, blendMode: 'color-dodge' },
  { id: 'fx-noise', name: 'Digital Noise', category: 'FX', type: 'texture', defaultSize: 100, defaultOpacity: 30, hardness: 100, spacing: 10, blendMode: 'overlay' },
  { id: 'fx-bokeh', name: 'Bokeh Lights', category: 'FX', type: 'texture', defaultSize: 120, defaultOpacity: 70, hardness: 10, spacing: 80, blendMode: 'screen' },
  { id: 'fx-fur', name: 'Animal Fur', category: 'FX', type: 'texture', defaultSize: 40, defaultOpacity: 80, hardness: 50, spacing: 10, blendMode: 'normal' },

  // --- RETOUCHING ---
  { id: 'r-dodge', name: 'Dodge (Lighten)', category: 'Retouching', type: 'soft', defaultSize: 60, defaultOpacity: 30, hardness: 0, spacing: 10, blendMode: 'color-dodge' },
  { id: 'r-burn', name: 'Burn (Darken)', category: 'Retouching', type: 'soft', defaultSize: 60, defaultOpacity: 30, hardness: 0, spacing: 10, blendMode: 'color-burn' },
  { id: 'r-sponge-desat', name: 'Sponge (Desaturate)', category: 'Retouching', type: 'soft', defaultSize: 80, defaultOpacity: 40, hardness: 0, spacing: 10, blendMode: 'color' }, // Using CSS color blend but requires white/black/gray
  { id: 'r-blur', name: 'Blur Tool', category: 'Retouching', type: 'soft', defaultSize: 50, defaultOpacity: 50, hardness: 0, spacing: 5, blendMode: 'normal' },
  { id: 'r-sharpen', name: 'Sharpen Tool', category: 'Retouching', type: 'soft', defaultSize: 40, defaultOpacity: 30, hardness: 50, spacing: 5, blendMode: 'overlay' }
];
