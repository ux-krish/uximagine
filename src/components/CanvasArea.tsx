import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import gsap from 'gsap';
import type { Adjustments } from '../types/adjustments';
import type { ToolState } from '../types/tools';

interface CanvasAreaProps {
  currentFile: File | null;
  adjustments: Adjustments;
  toolState: ToolState;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;
  h /= 360; s /= 100; l /= 100;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [r * 255, g * 255, b * 255];
}

function hueDistance(h1: number, h2: number) {
  const d = Math.abs(h1 - h2);
  return Math.min(d, 360 - d);
}

/**
 * Apply pixel-level adjustments that CSS filters can't handle
 */
function applyPixelAdjustments(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  adj: Adjustments
) {
  const needsColorMix =
    adj.redHue !== 0 || adj.redSat !== 0 || adj.redLum !== 0 ||
    adj.orangeHue !== 0 || adj.orangeSat !== 0 || adj.orangeLum !== 0 ||
    adj.yellowHue !== 0 || adj.yellowSat !== 0 || adj.yellowLum !== 0 ||
    adj.greenHue !== 0 || adj.greenSat !== 0 || adj.greenLum !== 0 ||
    adj.aquaHue !== 0 || adj.aquaSat !== 0 || adj.aquaLum !== 0 ||
    adj.blueHue !== 0 || adj.blueSat !== 0 || adj.blueLum !== 0 ||
    adj.purpleHue !== 0 || adj.purpleSat !== 0 || adj.purpleLum !== 0 ||
    adj.magentaHue !== 0 || adj.magentaSat !== 0 || adj.magentaLum !== 0;

  const needsColorGrading =
    adj.shadowsSat !== 0 || adj.midtonesSat !== 0 || adj.highlightsSat !== 0;

  const needsPixel =
    adj.highlights !== 0 || adj.shadows !== 0 || adj.whites !== 0 || adj.blacks !== 0 ||
    adj.dehaze !== 0 || adj.vignette !== 0 || adj.grain !== 0 || adj.sharpness !== 0 ||
    needsColorMix || needsColorGrading;

  if (!needsPixel) return;

  const mixChannels = [
    { target: 0, h: adj.redHue, s: adj.redSat, l: adj.redLum },
    { target: 30, h: adj.orangeHue, s: adj.orangeSat, l: adj.orangeLum },
    { target: 60, h: adj.yellowHue, s: adj.yellowSat, l: adj.yellowLum },
    { target: 120, h: adj.greenHue, s: adj.greenSat, l: adj.greenLum },
    { target: 180, h: adj.aquaHue, s: adj.aquaSat, l: adj.aquaLum },
    { target: 240, h: adj.blueHue, s: adj.blueSat, l: adj.blueLum },
    { target: 285, h: adj.purpleHue, s: adj.purpleSat, l: adj.purpleLum },
    { target: 315, h: adj.magentaHue, s: adj.magentaSat, l: adj.magentaLum },
  ];

  let shadowR = 0, shadowG = 0, shadowB = 0;
  let midR = 0, midG = 0, midB = 0;
  let highR = 0, highG = 0, highB = 0;

  if (needsColorGrading) {
    const sColor = hslToRgb(adj.shadowsHue, 100, 50);
    shadowR = sColor[0]; shadowG = sColor[1]; shadowB = sColor[2];
    const mColor = hslToRgb(adj.midtonesHue, 100, 50);
    midR = mColor[0]; midG = mColor[1]; midB = mColor[2];
    const hColor = hslToRgb(adj.highlightsHue, 100, 50);
    highR = hColor[0]; highG = hColor[1]; highB = hColor[2];
  }

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const len = data.length;

  for (let i = 0; i < len; i += 4) {
    let r = data[i], g = data[i + 1], b = data[i + 2];

    // Highlights: affect bright pixels (lum > 0.6)
    if (adj.highlights !== 0) {
      const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
      if (lum > 0.6) {
        const factor = 1 + (adj.highlights / 200) * (lum - 0.6) / 0.4;
        r = r * factor;
        g = g * factor;
        b = b * factor;
      }
    }

    // Shadows: affect dark pixels (lum < 0.4)
    if (adj.shadows !== 0) {
      const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
      if (lum < 0.4) {
        const factor = 1 + (adj.shadows / 200) * (0.4 - lum) / 0.4;
        r = r * factor;
        g = g * factor;
        b = b * factor;
      }
    }

    // Whites: push high-end
    if (adj.whites !== 0) {
      const push = adj.whites / 200;
      r = r + (255 - r) * push;
      g = g + (255 - g) * push;
      b = b + (255 - b) * push;
    }

    // Blacks: crush low-end
    if (adj.blacks !== 0) {
      const crush = adj.blacks / 200;
      r = r - r * crush;
      g = g - g * crush;
      b = b - b * crush;
    }

    // Dehaze: increase contrast + saturation in low-contrast areas
    if (adj.dehaze !== 0) {
      const factor = 1 + adj.dehaze / 150;
      const avg = (r + g + b) / 3;
      r = avg + (r - avg) * factor;
      g = avg + (g - avg) * factor;
      b = avg + (b - avg) * factor;
    }

    // Color Mix & Color Grading
    if (needsColorMix || needsColorGrading) {
      // Inlined rgbToHsl:
      const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
      const max = rNorm > gNorm ? (rNorm > bNorm ? rNorm : bNorm) : (gNorm > bNorm ? gNorm : bNorm);
      const min = rNorm < gNorm ? (rNorm < bNorm ? rNorm : bNorm) : (gNorm < bNorm ? gNorm : bNorm);
      let h = 0, s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === rNorm) {
          h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        } else if (max === gNorm) {
          h = (bNorm - rNorm) / d + 2;
        } else {
          h = (rNorm - gNorm) / d + 4;
        }
        h /= 6;
      }

      let hDeg = h * 360;
      let sPct = s * 100;
      let lPct = l * 100;

      if (needsColorMix && sPct > 5) {
        let hShift = 0, sShift = 0, lShift = 0;
        for (let cIdx = 0; cIdx < mixChannels.length; cIdx++) {
          const ch = mixChannels[cIdx];
          if (ch.h === 0 && ch.s === 0 && ch.l === 0) continue;
          let dist = Math.abs(hDeg - ch.target);
          if (dist > 180) dist = 360 - dist;
          if (dist < 40) {
            const weight = (1 - dist / 40) * (1 - dist / 40);
            hShift += ch.h * weight;
            sShift += ch.s * weight;
            lShift += ch.l * weight;
          }
        }
        hDeg = (hDeg + hShift + 360) % 360;
        sPct = sPct + sShift;
        if (sPct < 0) sPct = 0; else if (sPct > 100) sPct = 100;
        lPct = lPct + lShift;
        if (lPct < 0) lPct = 0; else if (lPct > 100) lPct = 100;
      }

      // Inlined hslToRgb:
      const hNorm = hDeg / 360;
      const sNorm = sPct / 100;
      const lNorm = lPct / 100;
      if (sNorm === 0) {
        r = g = b = lNorm * 255;
      } else {
        const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
        const p = 2 * lNorm - q;
        const hue2rgb = (t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        r = hue2rgb(hNorm + 1 / 3) * 255;
        g = hue2rgb(hNorm) * 255;
        b = hue2rgb(hNorm - 1 / 3) * 255;
      }

      if (needsColorGrading) {
        const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 2.55; // 0-100
        let tr = 0, tg = 0, tb = 0, tS = 0;
        if (lum < 33 && adj.shadowsSat > 0) {
           tr = shadowR; tg = shadowG; tb = shadowB;
           tS = adj.shadowsSat * (1 - lum / 33);
        } else if (lum >= 33 && lum < 66 && adj.midtonesSat > 0) {
           tr = midR; tg = midG; tb = midB;
           tS = adj.midtonesSat * (1 - Math.abs(lum - 50) / 16);
        } else if (lum >= 66 && adj.highlightsSat > 0) {
           tr = highR; tg = highG; tb = highB;
           tS = adj.highlightsSat * ((lum - 66) / 34);
        }
        
        if (tS > 0) {
          const blendAmt = (tS / 100) * 0.6; // max 60%
          r = r + (tr - r) * blendAmt;
          g = g + (tg - g) * blendAmt;
          b = b + (tb - b) * blendAmt;
        }
      }
    }

    // Grain (add noise)
    if (adj.grain > 0) {
      const intensity = adj.grain * 0.6;
      const noise = (Math.random() - 0.5) * intensity;
      r = r + noise;
      g = g + noise;
      b = b + noise;
    }

    // Clamp values at the end of the loop
    data[i] = r > 255 ? 255 : (r < 0 ? 0 : r);
    data[i + 1] = g > 255 ? 255 : (g < 0 ? 0 : g);
    data[i + 2] = b > 255 ? 255 : (b < 0 ? 0 : b);
  }

  ctx.putImageData(imageData, 0, 0);

  // Vignette: overlay radial gradient
  if (adj.vignette !== 0) {
    const cx = width / 2, cy = height / 2;
    const maxR = Math.sqrt(cx * cx + cy * cy);
    const gradient = ctx.createRadialGradient(cx, cy, maxR * 0.3, cx, cy, maxR);
    const alpha = Math.abs(adj.vignette) / 200;
    if (adj.vignette < 0) {
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, `rgba(0,0,0,${alpha})`);
    } else {
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, `rgba(255,255,255,${alpha})`);
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  // Sharpness: unsharp mask approximation via over-composite
  if (adj.sharpness > 0) {
    const amount = adj.sharpness / 400;
    const original = ctx.getImageData(0, 0, width, height);
    const sharp = ctx.getImageData(0, 0, width, height);
    const sd = sharp.data;
    const od = original.data;
    const w4 = width * 4;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        for (let c = 0; c < 3; c++) {
          const center = od[idx + c] * 5;
          const neighbors = od[idx - 4 + c] + od[idx + 4 + c] + od[idx - w4 + c] + od[idx + w4 + c];
          const diff = center - neighbors;
          sd[idx + c] = Math.min(255, Math.max(0, od[idx + c] + diff * amount));
        }
      }
    }
    ctx.putImageData(sharp, 0, 0);
  }
}

const CanvasArea: React.FC<CanvasAreaProps> = ({ currentFile, adjustments: adj, toolState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  
  const isDrawing = useRef(false);
  const lastDrawPos = useRef<{x: number, y: number} | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Tool states
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cloneSource, setCloneSource] = useState<{ x: number, y: number } | null>(null);
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  
  // Internal buffers
  const baseLayerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskLayerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cloneLayerCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const getImgCoords = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    return {
      x,
      y
    };
  }, []);

  const renderComposited = useCallback(() => {
    const canvas = canvasRef.current;
    const base = baseLayerCanvasRef.current;
    const mask = maskLayerCanvasRef.current;
    const clone = cloneLayerCanvasRef.current;
    if (!canvas || !base) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(base, 0, 0);
    if (clone) ctx.drawImage(clone, 0, 0);
    if (mask && toolState.activeTool === 'brush') {
      ctx.globalAlpha = 0.5;
      ctx.drawImage(mask, 0, 0);
      ctx.globalAlpha = 1.0;
    }
  }, [toolState.activeTool]);

  const paintMask = useCallback((e: React.MouseEvent) => {
    const coords = getImgCoords(e);
    const mask = maskLayerCanvasRef.current;
    if (!mask) return;
    const ctx = mask.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(coords.x, coords.y, toolState.brushSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 0, 0, ${toolState.brushOpacity / 100})`;
    ctx.fill();
    renderComposited();
  }, [toolState, getImgCoords, renderComposited]);

  const paintClone = useCallback((e: React.MouseEvent) => {
    if (!cloneSource) return;
    const coords = getImgCoords(e);
    const cloneCanvas = cloneLayerCanvasRef.current;
    const baseCanvas = baseLayerCanvasRef.current;
    if (!cloneCanvas || !baseCanvas) return;
    const ctx = cloneCanvas.getContext('2d');
    if (!ctx) return;

    const size = toolState.brushSize;
    const dx = coords.x - dragStart.x;
    const dy = coords.y - dragStart.y;
    const srcX = cloneSource.x + dx;
    const srcY = cloneSource.y + dy;

    ctx.save();
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, size, 0, Math.PI * 2);
    ctx.clip();
    
    ctx.globalAlpha = toolState.brushOpacity / 100;
    ctx.translate(coords.x - srcX, coords.y - srcY);
    ctx.drawImage(baseCanvas, 0, 0);
    ctx.restore();
    
    renderComposited();
  }, [cloneSource, getImgCoords, dragStart, toolState, renderComposited]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (toolState.activeTool !== 'hand') return;
    e.preventDefault();
    const zoomSensitivity = 0.0015;
    const zoomFactor = Math.exp(-e.deltaY * zoomSensitivity);
    let newScale = scale * zoomFactor;
    newScale = Math.max(0.1, Math.min(newScale, 15));

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;
      
      const newOffsetX = mouseX - (mouseX - offset.x) * (newScale / scale);
      const newOffsetY = mouseY - (mouseY - offset.y) * (newScale / scale);
      
      setScale(newScale);
      setOffset({ x: newOffsetX, y: newOffsetY });
    }
  }, [scale, offset, toolState.activeTool]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const coords = getImgCoords(e);
    const x = coords.x;
    const y = coords.y;

    if (toolState.activeTool === 'brush') {
      if (drawCanvasRef.current) {
        isDrawing.current = true;
        lastDrawPos.current = { x, y };
        const ctx = drawCanvasRef.current.getContext('2d');
        if (ctx) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.strokeStyle = toolState.brushColor || '#ffffff';
          ctx.lineWidth = toolState.brushSize;
          ctx.lineCap = 'round';
          ctx.globalAlpha = toolState.brushOpacity / 100;
          ctx.stroke();
        }
      }
      return;
    }

    if (toolState.activeTool === 'hand') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    } else if (toolState.activeTool === 'clone') {
      const coords = getImgCoords(e);
      if (e.altKey) {
        setCloneSource(coords);
      } else if (cloneSource) {
        setIsDragging(true);
        setDragStart({ x: coords.x, y: coords.y });
        paintClone(e);
      }
    }
  }, [toolState.activeTool, offset, getImgCoords, paintClone, scale]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDrawing.current && drawCanvasRef.current) {
      const coords = getImgCoords(e);
      const x = coords.x;
      const y = coords.y;
      const ctx = drawCanvasRef.current.getContext('2d');
      if (ctx && lastDrawPos.current) {
        ctx.lineTo(x, y);
        ctx.stroke();
        lastDrawPos.current = { x, y };
      }
      return;
    }

    if (toolState.activeTool === 'hand' && isDragging) {
      setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    } else if (toolState.activeTool === 'clone' && isDragging) {
      paintClone(e);
    }
    
    if (isMobile || !cursorGlowRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cursorGlowRef.current.style.background =
      `radial-gradient(400px circle at ${x}px ${y}px, rgba(124, 58, 237, 0.06), transparent 70%)`;
  }, [isMobile, isDragging, dragStart, toolState.activeTool, paintClone, offset, scale]);

  const handleMouseUp = useCallback(() => {
    isDrawing.current = false;
    lastDrawPos.current = null;
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cursorGlowRef.current) gsap.to(cursorGlowRef.current, { opacity: 0, duration: 0.4 });
    handleMouseUp();
  }, [handleMouseUp]);

  const handleMouseEnter = useCallback(() => {
    if (!isMobile && cursorGlowRef.current) gsap.to(cursorGlowRef.current, { opacity: 1, duration: 0.3 });
  }, [isMobile]);

  useEffect(() => {
    if (!currentFile || !canvasRef.current) return;

    const url = URL.createObjectURL(currentFile);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const parentEl = canvasWrapperRef.current;
      const maxWidth = (parentEl?.clientWidth || 800) - 64;
      const maxHeight = (parentEl?.clientHeight || 600) - 64;
      const imgWidth = img.width;
      const imgHeight = img.height;

      const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);
      const displayWidth = Math.round(imgWidth * ratio);
      const displayHeight = Math.round(imgHeight * ratio);

      canvas.width = imgWidth;
      canvas.height = imgHeight;

      if (drawCanvasRef.current) {
        if (drawCanvasRef.current.width !== imgWidth || drawCanvasRef.current.height !== imgHeight) {
          drawCanvasRef.current.width = imgWidth;
          drawCanvasRef.current.height = imgHeight;
        }
      }

      // Init offscreen buffers at full resolution
      let baseCanvas = baseLayerCanvasRef.current;
      if (!baseCanvas || baseCanvas.width !== imgWidth || baseCanvas.height !== imgHeight) {
        baseCanvas = document.createElement('canvas');
        baseCanvas.width = imgWidth;
        baseCanvas.height = imgHeight;
        baseLayerCanvasRef.current = baseCanvas;
        
        const m = document.createElement('canvas');
        m.width = imgWidth; m.height = imgHeight;
        maskLayerCanvasRef.current = m;
        
        const c = document.createElement('canvas');
        c.width = imgWidth; c.height = imgHeight;
        cloneLayerCanvasRef.current = c;
      }

      const ctx = baseCanvas.getContext('2d');
      if (!ctx) return;

      // CSS-level filters
      const brightness = 100 + adj.exposure;
      const contrast = 100 + adj.contrast + (adj.clarity * 0.3);
      const saturate = 100 + adj.saturation + (adj.vibrance * 0.5);
      const blur = adj.noiseReduction > 0 ? adj.noiseReduction * 0.02 : 0;
      // Temperature: warm = sepia + hue-rotate, cool = hue-rotate opposite
      const sepia = adj.temperature > 0 ? adj.temperature * 0.15 : 0;
      const hueRotate = adj.temperature < 0 ? adj.temperature * 0.5 : adj.tint * 0.8;
      const lumFilter = adj.luminance > 0 ? 100 + adj.luminance * 0.3 : 100;

      let filterStr = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) brightness(${lumFilter}%)`;
      if (sepia > 0) filterStr += ` sepia(${sepia}%)`;
      if (hueRotate !== 0) filterStr += ` hue-rotate(${hueRotate}deg)`;
      if (blur > 0) filterStr += ` blur(${blur}px)`;

      ctx.filter = filterStr;

      // Transform: rotation and flip
      ctx.save();
      ctx.translate(imgWidth / 2, imgHeight / 2);
      const scaleX = adj.flipH ? -1 : 1;
      const scaleY = adj.flipV ? -1 : 1;
      ctx.scale(scaleX, scaleY);
      ctx.rotate((adj.rotation * Math.PI) / 180);
      ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
      ctx.restore();

      // Reset filter before pixel manipulation
      ctx.filter = 'none';

      // Pixel-level adjustments
      applyPixelAdjustments(ctx, imgWidth, imgHeight, adj);

      renderComposited();

      URL.revokeObjectURL(url);
      
      setDisplaySize({ width: displayWidth, height: displayHeight });

      // GSAP entrance
      if (canvasWrapperRef.current) {
        gsap.fromTo(canvasWrapperRef.current,
          { scale: 0.92, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.7, ease: 'power4.out' }
        );
      }
    };
    img.src = url;
  }, [currentFile, adj]);

  return (
    <Box
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={(e) => { handleMouseLeave(); handleMouseUp(); }}
      onMouseEnter={handleMouseEnter}
      sx={{
        flexGrow: 1,
        position: 'relative',
        background: 'var(--ux-bg-deep)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        minHeight: 0,
        cursor: toolState.activeTool === 'hand' ? (isDragging ? 'grabbing' : 'grab') : 'crosshair',
        // Noise texture (desktop only)
        ...(!isMobile && {
          '&::before': {
            content: '""', position: 'absolute', inset: 0, opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '128px 128px', pointerEvents: 'none', zIndex: 0,
          },
          '&::after': {
            content: '""', position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
            pointerEvents: 'none', zIndex: 1,
          },
        }),
      }}
    >
      {/* Cursor glow */}
      {!isMobile && (
        <Box ref={cursorGlowRef}
          sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, opacity: 0, transition: 'opacity 0.3s' }}
        />
      )}

      {currentFile ? (
        <Box ref={canvasWrapperRef}
          sx={{
            position: 'relative', zIndex: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            p: { xs: 1, md: 4 }, width: '100%', height: '100%',
          }}
        >
          <Box
            style={{
              position: 'relative',
              width: displaySize.width || 'auto',
              height: displaySize.height || 'auto',
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              boxShadow: isMobile
                ? '0 4px 20px rgba(0,0,0,0.4)'
                : '0 12px 60px rgba(0,0,0,0.6), 0 0 40px rgba(124,58,237,0.08)',
              borderRadius: isMobile ? '4px' : '8px',
            }}
          >
            <canvas ref={canvasRef}
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                borderRadius: 'inherit',
              }}
            />
            <canvas ref={drawCanvasRef}
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                pointerEvents: toolState.activeTool === 'brush' ? 'auto' : 'none',
                borderRadius: 'inherit',
              }}
            />
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 2, animation: 'floatUp 4s ease-in-out infinite',
            px: 3, textAlign: 'center',
          }}
        >
          <Box sx={{
            width: { xs: 48, md: 64 }, height: { xs: 48, md: 64 }, borderRadius: { xs: '12px', md: '16px' },
            background: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124, 58, 237, 0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(124, 58, 237, 0.1)',
          }}>
            <PhotoCameraOutlinedIcon sx={{ fontSize: { xs: 22, md: 28 }, color: '#7c3aed' }} />
          </Box>
          <Typography sx={{
            fontSize: { xs: '0.8rem', md: '0.9rem' }, fontWeight: 500,
            background: 'linear-gradient(135deg, #e4e4eb, #7c3aed)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Drop or select an image
          </Typography>
          <Typography sx={{ fontSize: { xs: '0.6rem', md: '0.68rem' }, color: 'var(--ux-text-muted)' }}>
            Supports RAW formats and standard images
          </Typography>
        </Box>
      )}

      {/* Zoom pill */}
      <Box sx={{
        position: 'absolute', bottom: { xs: 8, md: 16 }, right: { xs: 8, md: 16 }, zIndex: 4,
        background: 'rgba(10, 10, 18, 0.7)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.06)', borderRadius: '100px',
        px: 1.5, py: 0.4, display: 'flex', alignItems: 'center', gap: 0.5,
      }}>
        <Typography sx={{ fontSize: '0.62rem', color: 'var(--ux-text-muted)', fontWeight: 500 }}>
          {Math.round(scale * 100)}%
        </Typography>
      </Box>
    </Box>
  );
};

export default CanvasArea;
