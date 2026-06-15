import type { Adjustments } from '../types/adjustments';

export interface Preset {
  id: string;
  name: string;
  category: string;
  adjustments: Partial<Adjustments>;
}

export const PRESETS: Preset[] = [
  // --- CINEMATIC ---
  { id: 'cinematic-teal-orange', name: 'Teal & Orange', category: 'Cinematic', adjustments: { exposure: 5, contrast: 25, highlights: -15, shadows: 20, temperature: 10, tint: 5, vibrance: 15, blueHue: -15, blueSat: 20, orangeSat: 15, shadowsHue: 210, shadowsSat: 15, highlightsHue: 35, highlightsSat: 25, clarity: 15, vignette: -10 } },
  { id: 'cinematic-moody-dark', name: 'Moody Dark', category: 'Cinematic', adjustments: { exposure: -15, contrast: 30, highlights: -40, shadows: -10, whites: -20, blacks: 10, vibrance: -15, saturation: -5, greenSat: -40, greenLum: -20, blueSat: -30, clarity: 25, vignette: -20 } },
  { id: 'cinematic-cyberpunk', name: 'Cyberpunk', category: 'Cinematic', adjustments: { exposure: -5, contrast: 35, highlights: -30, shadows: 15, temperature: -20, tint: 25, vibrance: 40, blueHue: 15, blueSat: 35, purpleHue: -10, purpleSat: 40, magentaSat: 30, orangeHue: -15, shadowsHue: 240, shadowsSat: 25, highlightsHue: 310, highlightsSat: 30, clarity: 20 } },
  { id: 'cinematic-blockbuster', name: 'Blockbuster', category: 'Cinematic', adjustments: { exposure: 10, contrast: 30, highlights: -25, shadows: 15, vibrance: 20, clarity: 25, blueSat: -10, blueLum: -15, orangeSat: 20, orangeLum: 10, vignette: -15 } },
  { id: 'cinematic-matrix', name: 'The Matrix', category: 'Cinematic', adjustments: { exposure: -10, contrast: 25, highlights: -20, temperature: -15, tint: -30, vibrance: 10, greenHue: 10, greenSat: 30, greenLum: 10, blueSat: -50, shadowsHue: 120, shadowsSat: 20, clarity: 15 } },
  { id: 'cinematic-mars', name: 'Martian Rust', category: 'Cinematic', adjustments: { exposure: 0, contrast: 20, highlights: -15, temperature: 30, tint: 10, vibrance: 15, blueSat: -60, aquaSat: -50, orangeHue: -5, orangeSat: 30, redSat: 20, shadowsHue: 15, shadowsSat: 15, clarity: 10 } },
  { id: 'cinematic-neon-nights', name: 'Neon Nights', category: 'Cinematic', adjustments: { exposure: -20, contrast: 40, highlights: -30, shadows: 25, whites: -20, blacks: 15, vibrance: 35, blueSat: 40, magentaSat: 45, aquaSat: 30, yellowSat: -40, clarity: 25, dehaze: 10 } },
  { id: 'cinematic-bleach-bypass', name: 'Bleach Bypass', category: 'Cinematic', adjustments: { exposure: -5, contrast: 50, highlights: -30, shadows: -15, whites: 20, blacks: -20, vibrance: -40, saturation: -25, clarity: 35, grain: 15, vignette: -15 } },
  
  // --- FILM EMULATION ---
  { id: 'film-kodak-gold', name: 'Kodak Gold 200', category: 'Film', adjustments: { exposure: 10, contrast: 15, highlights: -15, shadows: 10, temperature: 15, tint: 5, vibrance: 10, yellowHue: -5, yellowSat: 20, orangeSat: 15, blueHue: -10, shadowsHue: 40, shadowsSat: 10, grain: 20, clarity: -5 } },
  { id: 'film-fuji-pro', name: 'Fuji Pro 400H', category: 'Film', adjustments: { exposure: 15, contrast: 10, highlights: -25, shadows: 20, whites: -15, blacks: 15, temperature: -5, tint: 15, vibrance: 5, greenHue: 10, greenSat: -10, blueHue: -5, blueSat: -10, shadowsHue: 150, shadowsSat: 8, highlightsHue: 45, highlightsSat: 5, grain: 15 } },
  { id: 'film-portra-400', name: 'Kodak Portra 400', category: 'Film', adjustments: { exposure: 5, contrast: -5, highlights: -20, shadows: 25, whites: -10, blacks: 15, temperature: 8, tint: 2, vibrance: 10, redHue: 5, orangeLum: 10, yellowSat: -10, greenSat: -15, blueSat: 5, shadowsHue: 20, shadowsSat: 5, grain: 12, clarity: -10 } },
  { id: 'film-ilford-hp5', name: 'Ilford HP5', category: 'Film', adjustments: { exposure: 0, contrast: 25, highlights: -15, shadows: 10, whites: 10, blacks: -10, saturation: -100, clarity: 15, grain: 30 } },
  { id: 'film-agfa-vista', name: 'Agfa Vista 100', category: 'Film', adjustments: { exposure: 5, contrast: 20, highlights: -10, shadows: 10, temperature: 5, tint: -5, vibrance: 25, redSat: 30, redHue: 5, blueSat: 15, greenSat: 10, grain: 18 } },
  { id: 'film-cinestill', name: 'CineStill 800T', category: 'Film', adjustments: { exposure: 5, contrast: 15, highlights: -30, shadows: 20, temperature: -25, tint: -10, vibrance: 15, redHue: -15, redSat: 40, redLum: 20, aquaSat: 20, blueSat: 15, highlightsHue: 0, highlightsSat: 15, shadowsHue: 200, shadowsSat: 10, grain: 25, clarity: 10 } },
  { id: 'film-polaroid', name: 'Polaroid Fade', category: 'Film', adjustments: { exposure: 10, contrast: -20, highlights: -40, shadows: 40, whites: -20, blacks: 40, temperature: 15, tint: 10, vibrance: -15, saturation: -10, shadowsHue: 45, shadowsSat: 20, highlightsHue: 210, highlightsSat: 10, clarity: -15, grain: 15, vignette: -20 } },
  { id: 'film-velvia', name: 'Fuji Velvia 50', category: 'Film', adjustments: { exposure: -5, contrast: 30, highlights: -20, shadows: -10, whites: 15, blacks: -15, temperature: 5, tint: 5, vibrance: 40, saturation: 15, greenSat: 35, blueSat: 30, redSat: 25, clarity: 15, grain: 5 } },

  // --- BLACK & WHITE ---
  { id: 'bw-high-contrast', name: 'High Contrast', category: 'B&W', adjustments: { exposure: 0, contrast: 45, highlights: 10, shadows: -20, whites: 25, blacks: -30, saturation: -100, clarity: 25, dehaze: 10 } },
  { id: 'bw-matte', name: 'Matte B&W', category: 'B&W', adjustments: { exposure: 5, contrast: -10, highlights: -25, shadows: 30, whites: -15, blacks: 35, saturation: -100, clarity: 5, grain: 15 } },
  { id: 'bw-sepia', name: 'Classic Sepia', category: 'B&W', adjustments: { exposure: 0, contrast: 15, highlights: -10, shadows: 15, blacks: 10, saturation: -100, shadowsHue: 35, shadowsSat: 30, highlightsHue: 40, highlightsSat: 15, clarity: 10, grain: 20, vignette: -15 } },
  { id: 'bw-noir', name: 'Film Noir', category: 'B&W', adjustments: { exposure: -10, contrast: 60, highlights: -15, shadows: -40, whites: 10, blacks: -50, saturation: -100, clarity: 35, dehaze: 15, vignette: -30, grain: 10 } },
  { id: 'bw-soft', name: 'Soft B&W', category: 'B&W', adjustments: { exposure: 10, contrast: -20, highlights: -30, shadows: 25, whites: -20, blacks: 20, saturation: -100, clarity: -20, dehaze: -10 } },
  { id: 'bw-blue-tint', name: 'Cyanotype', category: 'B&W', adjustments: { exposure: 0, contrast: 20, highlights: -10, shadows: 10, saturation: -100, shadowsHue: 210, shadowsSat: 35, highlightsHue: 200, highlightsSat: 20, clarity: 10 } },
  { id: 'bw-punchy', name: 'Punchy Silver', category: 'B&W', adjustments: { exposure: 5, contrast: 35, highlights: -10, shadows: 5, whites: 30, blacks: -20, saturation: -100, clarity: 40, sharpness: 25, grain: 5 } },
  { id: 'bw-infrared', name: 'Infrared Sim', category: 'B&W', adjustments: { exposure: 10, contrast: 40, highlights: 30, shadows: -20, greenLum: 100, yellowLum: 80, blueLum: -80, saturation: -100, clarity: 30, dehaze: 15, grain: 15 } },

  // --- PORTRAIT ---
  { id: 'portrait-soft-skin', name: 'Soft Skin', category: 'Portrait', adjustments: { exposure: 5, contrast: -10, highlights: -15, shadows: 15, whites: -5, blacks: 5, temperature: 5, tint: 0, vibrance: 5, redHue: 5, orangeLum: 15, yellowSat: -10, clarity: -25, sharpness: -10 } },
  { id: 'portrait-bright-airy', name: 'Bright & Airy', category: 'Portrait', adjustments: { exposure: 20, contrast: -15, highlights: -30, shadows: 25, whites: -10, blacks: 20, temperature: -5, tint: 5, vibrance: 15, orangeSat: -5, orangeLum: 15, greenSat: -20, blueSat: -15, clarity: -15 } },
  { id: 'portrait-warm-glow', name: 'Warm Glow', category: 'Portrait', adjustments: { exposure: 5, contrast: 5, highlights: -10, shadows: 10, temperature: 15, tint: 5, vibrance: 15, orangeHue: -5, orangeSat: 10, orangeLum: 5, yellowSat: 15, highlightsHue: 40, highlightsSat: 10, clarity: -5 } },
  { id: 'portrait-studio', name: 'Studio Pop', category: 'Portrait', adjustments: { exposure: 5, contrast: 20, highlights: -10, shadows: 5, whites: 10, blacks: -10, temperature: 0, tint: 0, vibrance: 20, redSat: 10, orangeLum: 10, clarity: 15, sharpness: 15 } },
  { id: 'portrait-moody', name: 'Moody Portrait', category: 'Portrait', adjustments: { exposure: -10, contrast: 15, highlights: -30, shadows: 5, blacks: 15, temperature: 10, tint: 5, vibrance: -15, orangeSat: -10, orangeLum: 5, greenSat: -40, blueSat: -30, clarity: 10, vignette: -20 } },
  { id: 'portrait-fashion', name: 'High Fashion', category: 'Portrait', adjustments: { exposure: 10, contrast: 30, highlights: -15, shadows: 10, whites: 20, blacks: -15, vibrance: -10, redSat: 20, orangeSat: -15, orangeLum: 20, clarity: 20, sharpness: 30 } },
  { id: 'portrait-peachy', name: 'Peachy', category: 'Portrait', adjustments: { exposure: 15, contrast: -5, highlights: -20, shadows: 15, temperature: 12, tint: 15, vibrance: 10, orangeHue: -10, orangeSat: 15, yellowSat: -20, greenSat: -30, clarity: -10 } },
  { id: 'portrait-vintage', name: 'Vintage Glam', category: 'Portrait', adjustments: { exposure: 5, contrast: -15, highlights: -25, shadows: 30, blacks: 25, temperature: 10, tint: -5, vibrance: -20, shadowsHue: 35, shadowsSat: 15, clarity: -30, grain: 20 } },

  // --- LANDSCAPE ---
  { id: 'landscape-vibrant', name: 'Vibrant Greens', category: 'Landscape', adjustments: { exposure: 5, contrast: 15, highlights: -25, shadows: 20, vibrance: 30, saturation: 5, greenHue: 15, greenSat: 35, greenLum: -10, yellowHue: 10, yellowSat: 20, blueSat: 15, clarity: 25, dehaze: 10 } },
  { id: 'landscape-golden-hour', name: 'Golden Hour', category: 'Landscape', adjustments: { exposure: 5, contrast: 10, highlights: -30, shadows: 15, temperature: 25, tint: 10, vibrance: 25, yellowHue: -10, yellowSat: 30, orangeSat: 25, redSat: 15, shadowsHue: 30, shadowsSat: 10, highlightsHue: 45, highlightsSat: 20, clarity: 15 } },
  { id: 'landscape-crisp', name: 'Crisp Mountain', category: 'Landscape', adjustments: { exposure: 0, contrast: 25, highlights: -20, shadows: -5, whites: 15, blacks: -15, temperature: -10, tint: 5, vibrance: 15, blueHue: -5, blueSat: 25, blueLum: -15, greenSat: -10, clarity: 35, dehaze: 20, sharpness: 40 } },
  { id: 'landscape-deep-blue', name: 'Deep Blue Sky', category: 'Landscape', adjustments: { exposure: -5, contrast: 15, highlights: -40, shadows: 10, vibrance: 20, blueHue: -15, blueSat: 40, blueLum: -30, aquaHue: 15, aquaSat: 25, clarity: 20 } },
  { id: 'landscape-autumn', name: 'Autumn Colors', category: 'Landscape', adjustments: { exposure: 5, contrast: 15, highlights: -20, shadows: 10, temperature: 15, tint: 10, vibrance: 30, greenHue: -40, greenSat: -20, yellowHue: -25, yellowSat: 35, orangeHue: -5, orangeSat: 25, clarity: 15 } },
  { id: 'landscape-sunset', name: 'Sunset Boost', category: 'Landscape', adjustments: { exposure: 5, contrast: 20, highlights: -40, shadows: 25, temperature: 20, tint: 15, vibrance: 35, redSat: 30, orangeSat: 40, yellowSat: 30, blueSat: 10, blueLum: -20, highlightsHue: 20, highlightsSat: 25, dehaze: 10 } },
  { id: 'landscape-snow', name: 'Winter Snow', category: 'Landscape', adjustments: { exposure: 15, contrast: 20, highlights: -50, shadows: 10, whites: 30, blacks: -10, temperature: -15, tint: 5, vibrance: 10, blueSat: 15, blueLum: 10, clarity: 25, dehaze: 5 } },
  { id: 'landscape-forest', name: 'Deep Forest', category: 'Landscape', adjustments: { exposure: -10, contrast: 25, highlights: -30, shadows: 15, blacks: -10, temperature: -5, tint: 15, vibrance: 20, greenHue: 25, greenSat: 10, greenLum: -25, yellowHue: 15, yellowSat: -10, clarity: 30, vignette: -15 } },

  // --- MOODY & STREET ---
  { id: 'moody-dark-matte', name: 'Dark Matte', category: 'Moody', adjustments: { exposure: -15, contrast: -5, highlights: -30, shadows: 20, whites: -20, blacks: 40, temperature: 5, tint: 5, vibrance: -25, greenSat: -50, blueSat: -40, clarity: 15, vignette: -20 } },
  { id: 'moody-urban', name: 'Urban Desat', category: 'Moody', adjustments: { exposure: -5, contrast: 35, highlights: -25, shadows: 5, whites: 10, blacks: -15, temperature: -10, tint: 10, vibrance: -30, saturation: -15, orangeSat: 15, blueSat: 10, greenSat: -80, yellowSat: -80, clarity: 35, grain: 10 } },
  { id: 'moody-street-night', name: 'Street Night', category: 'Moody', adjustments: { exposure: 10, contrast: 30, highlights: -50, shadows: 30, whites: 15, blacks: 10, temperature: -15, tint: 20, vibrance: 25, orangeSat: 35, yellowSat: 20, blueSat: -20, clarity: 25, dehaze: 15, grain: 20 } },
  { id: 'moody-rainy', name: 'Rainy Day', category: 'Moody', adjustments: { exposure: -10, contrast: 15, highlights: -20, shadows: 5, blacks: 15, temperature: -20, tint: -5, vibrance: -20, blueHue: -10, blueSat: -10, clarity: 20, dehaze: 10, vignette: -15 } },
  { id: 'moody-coffee', name: 'Coffee Shop', category: 'Moody', adjustments: { exposure: 0, contrast: 10, highlights: -30, shadows: 25, blacks: 20, temperature: 25, tint: 10, vibrance: 5, blueSat: -50, greenSat: -50, orangeHue: -5, orangeSat: 15, shadowsHue: 30, shadowsSat: 15, clarity: 5, grain: 15 } },
  { id: 'moody-abandoned', name: 'Abandoned', category: 'Moody', adjustments: { exposure: -15, contrast: 40, highlights: -40, shadows: 10, blacks: -10, temperature: 10, tint: -15, vibrance: -40, greenHue: -20, greenSat: -30, blueSat: -60, clarity: 45, dehaze: 25, vignette: -25, grain: 25 } },

  // --- VINTAGE & RETRO ---
  { id: 'vintage-70s', name: '1970s Retro', category: 'Vintage', adjustments: { exposure: 5, contrast: -15, highlights: -20, shadows: 25, blacks: 30, temperature: 20, tint: -10, vibrance: -15, redHue: -15, greenHue: -20, blueHue: -20, shadowsHue: 50, shadowsSat: 20, highlightsHue: 60, highlightsSat: 15, clarity: -15, grain: 25 } },
  { id: 'vintage-faded', name: 'Faded Print', category: 'Vintage', adjustments: { exposure: 10, contrast: -30, highlights: -20, shadows: 40, whites: -15, blacks: 50, temperature: 10, vibrance: -25, saturation: -15, shadowsHue: 20, shadowsSat: 10, clarity: -20, grain: 15, vignette: -10 } },
  { id: 'vintage-warm', name: 'Warm Nostalgia', category: 'Vintage', adjustments: { exposure: 5, contrast: -5, highlights: -15, shadows: 15, blacks: 20, temperature: 30, tint: 15, vibrance: -10, blueSat: -30, shadowsHue: 35, shadowsSat: 25, clarity: -10, grain: 20 } },
  { id: 'vintage-cool', name: 'Cool Nostalgia', category: 'Vintage', adjustments: { exposure: 0, contrast: -10, highlights: -10, shadows: 20, blacks: 25, temperature: -15, tint: -5, vibrance: -15, redSat: -20, shadowsHue: 210, shadowsSat: 20, clarity: -10, grain: 20 } },
  { id: 'vintage-lomo', name: 'Lomography', category: 'Vintage', adjustments: { exposure: 5, contrast: 40, highlights: -20, shadows: -10, blacks: -15, temperature: 15, tint: 25, vibrance: 35, greenHue: 25, blueHue: -20, shadowsHue: 280, shadowsSat: 15, highlightsHue: 50, highlightsSat: 25, clarity: 20, vignette: -40, grain: 15 } },
  { id: 'vintage-light-leak', name: 'Sun Kissed', category: 'Vintage', adjustments: { exposure: 15, contrast: -20, highlights: 10, shadows: 30, blacks: 35, temperature: 35, tint: 15, vibrance: 10, shadowsHue: 25, shadowsSat: 25, highlightsHue: 40, highlightsSat: 30, clarity: -25, grain: 10 } },

  // --- HDR & DRAMA ---
  { id: 'drama-hdr', name: 'HDR Punch', category: 'Drama', adjustments: { exposure: 0, contrast: 25, highlights: -60, shadows: 60, whites: 20, blacks: -30, vibrance: 35, clarity: 60, dehaze: 15, sharpness: 50 } },
  { id: 'drama-grunge', name: 'Grunge', category: 'Drama', adjustments: { exposure: -10, contrast: 45, highlights: -20, shadows: 10, whites: 10, blacks: 20, temperature: 10, tint: 15, vibrance: -30, saturation: -15, redSat: -20, blueSat: -40, clarity: 70, dehaze: 25, vignette: -35, grain: 20 } },
  { id: 'drama-epic', name: 'Epic Sky', category: 'Drama', adjustments: { exposure: -5, contrast: 20, highlights: -80, shadows: 20, whites: 10, blacks: -10, vibrance: 40, blueHue: -15, blueSat: 50, blueLum: -30, aquaSat: 30, clarity: 40, dehaze: 25 } },
  { id: 'drama-dark-knight', name: 'Dark Knight', category: 'Drama', adjustments: { exposure: -25, contrast: 50, highlights: -30, shadows: 10, whites: -10, blacks: -10, temperature: -20, tint: 5, vibrance: -10, saturation: -20, blueSat: 20, orangeSat: 15, clarity: 30, dehaze: 20, vignette: -40 } },

  // --- PASTEL & DREAMY ---
  { id: 'pastel-pink', name: 'Cotton Candy', category: 'Pastel', adjustments: { exposure: 15, contrast: -10, highlights: -30, shadows: 25, temperature: 15, tint: 35, vibrance: 20, blueHue: -20, blueSat: 15, magentaSat: 25, clarity: -15, dehaze: -10 } },
  { id: 'pastel-mint', name: 'Minty Fresh', category: 'Pastel', adjustments: { exposure: 10, contrast: 0, highlights: -20, shadows: 15, temperature: -15, tint: -10, vibrance: 15, greenHue: 15, greenSat: 20, greenLum: 10, aquaSat: 25, clarity: -10 } },
  { id: 'pastel-peach', name: 'Peach Glow', category: 'Pastel', adjustments: { exposure: 10, contrast: -5, highlights: -15, shadows: 20, temperature: 20, tint: 10, vibrance: 15, orangeSat: 20, orangeLum: 10, redSat: 15, yellowSat: 10, clarity: -10 } },
  { id: 'pastel-dream', name: 'Dream State', category: 'Pastel', adjustments: { exposure: 20, contrast: -25, highlights: -40, shadows: 40, whites: -10, blacks: 30, temperature: -5, tint: 10, vibrance: 5, saturation: -10, clarity: -40, dehaze: -15, grain: 10 } },

  // --- FOOD & PRODUCT ---
  { id: 'food-bright', name: 'Fresh & Bright', category: 'Food', adjustments: { exposure: 15, contrast: 15, highlights: -20, shadows: 15, whites: 10, blacks: -5, temperature: 5, tint: 5, vibrance: 25, redSat: 20, orangeSat: 15, yellowSat: 15, greenSat: 20, clarity: 15, sharpness: 25 } },
  { id: 'food-moody', name: 'Rustic Table', category: 'Food', adjustments: { exposure: -10, contrast: 25, highlights: -20, shadows: 10, whites: 10, blacks: -15, temperature: 15, tint: 5, vibrance: 10, redSat: 15, orangeSat: 10, blueSat: -30, clarity: 20, vignette: -20 } },
  { id: 'product-clean', name: 'Clean White', category: 'Product', adjustments: { exposure: 20, contrast: 10, highlights: 10, shadows: 15, whites: 25, blacks: -5, temperature: -5, tint: 0, vibrance: 10, yellowSat: -15, blueSat: -10, clarity: 10, sharpness: 30 } },

  // --- ARCHITECTURE ---
  { id: 'arch-crisp', name: 'Crisp Lines', category: 'Architecture', adjustments: { exposure: 5, contrast: 25, highlights: -25, shadows: 15, whites: 10, blacks: -20, vibrance: 15, blueHue: -5, blueSat: 20, clarity: 40, dehaze: 10, sharpness: 45 } },
  { id: 'arch-monolith', name: 'Dark Monolith', category: 'Architecture', adjustments: { exposure: -15, contrast: 40, highlights: -20, shadows: -10, whites: -10, blacks: -30, temperature: -10, tint: -5, vibrance: -30, saturation: -20, blueSat: -40, clarity: 50, dehaze: 20, vignette: -25 } }
];
