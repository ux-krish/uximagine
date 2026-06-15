import type { BlendMode } from '../utils/brushes';

export type ToolType = 'hand' | 'brush' | 'clone';

export interface ToolState {
  activeTool: ToolType;
  brushId: string;
  brushSize: number;
  brushHardness: number;
  brushOpacity: number;
  brushSpacing: number;
  brushBlendMode: BlendMode;
  brushColor: string;
}

export const DEFAULT_TOOL_STATE: ToolState = {
  activeTool: 'hand',
  brushId: 'b-hard-round',
  brushSize: 20,
  brushHardness: 100,
  brushOpacity: 100,
  brushSpacing: 5,
  brushBlendMode: 'normal',
  brushColor: '#ffffff',
};
