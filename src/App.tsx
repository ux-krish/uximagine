import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import gsap from 'gsap';
import Header from './components/Header';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import CanvasArea from './components/CanvasArea';
import Toolbar from './components/Toolbar';
import BulkExportModal from './components/BulkExportModal';
import BrushPanel from './components/BrushPanel';
import PhotoInfoModal from './components/PhotoInfoModal';
import MobileToolbar from './components/MobileToolbar';
import { isRawFile } from './utils/fileTypes';
import { extractPreviewFromRaw } from './utils/rawConverter';
import { type Adjustments, DEFAULT_ADJUSTMENTS } from './types/adjustments';
import { type ToolState, DEFAULT_TOOL_STATE } from './types/tools';

const MAX_HISTORY = 30;

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  // Adjustments state + undo/redo
  const [adjustments, setAdjustments] = useState<Adjustments>({ ...DEFAULT_ADJUSTMENTS });
  const [history, setHistory] = useState<Adjustments[]>([{ ...DEFAULT_ADJUSTMENTS }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Per-file adjustments dictionary
  const [fileAdjustments, setFileAdjustments] = useState<Record<string, Adjustments>>({});

  const getFileKey = useCallback((f: File) => `${f.name}-${f.lastModified}`, []);

  // Sync current adjustments to the dictionary
  useEffect(() => {
    if (currentFile) {
      setFileAdjustments(prev => ({
        ...prev,
        [getFileKey(currentFile)]: adjustments
      }));
    }
  }, [adjustments, currentFile, getFileKey]);

  // Tools
  const [toolState, setToolState] = useState<ToolState>(DEFAULT_TOOL_STATE);

  // UI State
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [mobilePanel, setMobilePanel] = useState<'library' | 'adjustments' | 'tools' | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const headerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // GSAP entrance animation (desktop only)
  useEffect(() => {
    if (isMobile) {
      [headerRef, canvasRef].forEach(ref => {
        if (ref.current) gsap.set(ref.current, { opacity: 1, scale: 1, y: 0, x: 0 });
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (headerRef.current) {
        tl.fromTo(headerRef.current, { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
      }
      if (leftPanelRef.current) {
        tl.fromTo(leftPanelRef.current, { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 }, '-=0.5');
      }
      if (canvasRef.current) {
        tl.fromTo(canvasRef.current, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'power4.out' }, '-=0.5');
      }
      if (rightPanelRef.current) {
        tl.fromTo(rightPanelRef.current, { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 }, '-=0.6');
      }

      tl.call(() => {
        [leftPanelRef.current, rightPanelRef.current].forEach((el) => {
          if (el) gsap.to(el, { borderColor: 'rgba(124, 58, 237, 0.12)', duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        });
      });
    });

    return () => ctx.revert();
  }, [isMobile]);

  // Handle panel toggles with animations
  useEffect(() => {
    if (!isMobile && leftPanelRef.current && leftOpen) {
      gsap.fromTo(leftPanelRef.current, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' });
    }
  }, [leftOpen, isMobile]);

  useEffect(() => {
    if (!isMobile && rightPanelRef.current && rightOpen) {
      gsap.fromTo(rightPanelRef.current, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' });
    }
  }, [rightOpen, isMobile]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Adjustment change with history
  const handleAdjustmentChange = useCallback((key: keyof Adjustments, val: number | boolean) => {
    setAdjustments(prev => {
      const next = { ...prev, [key]: val };

      // Push to history (trim future)
      setHistory(h => {
        const newHistory = [...h.slice(0, historyIndex + 1), { ...next }];
        if (newHistory.length > MAX_HISTORY) newHistory.shift();
        return newHistory;
      });
      setHistoryIndex(i => Math.min(i + 1, MAX_HISTORY - 1));

      return next;
    });
  }, [historyIndex]);

  const handleResetAll = useCallback(() => {
    const reset = { ...DEFAULT_ADJUSTMENTS };
    setAdjustments(reset);
    setHistory(h => [...h.slice(0, historyIndex + 1), reset]);
    setHistoryIndex(i => i + 1);
  }, [historyIndex]);

  const handleApplyPreset = useCallback((presetAdj: Partial<Adjustments>) => {
    setAdjustments(prev => {
      const next = {
        ...DEFAULT_ADJUSTMENTS,
        rotation: prev.rotation,
        flipH: prev.flipH,
        flipV: prev.flipV,
        ...presetAdj
      };

      setHistory(h => {
        const newHistory = [...h.slice(0, historyIndex + 1), next];
        if (newHistory.length > MAX_HISTORY) newHistory.shift();
        return newHistory;
      });
      setHistoryIndex(i => Math.min(i + 1, MAX_HISTORY - 1));

      return next;
    });
  }, [historyIndex]);

  const handleAutoEnhance = useCallback(() => {
    setAdjustments(prev => {
      const next = {
        ...prev,
        exposure: 15,
        contrast: 20,
        highlights: -25,
        shadows: 30,
        whites: 15,
        blacks: -15,
        vibrance: 25,
        sharpness: 50,
        clarity: 15,
      };

      setHistory(h => {
        const newHistory = [...h.slice(0, historyIndex + 1), next];
        if (newHistory.length > MAX_HISTORY) newHistory.shift();
        return newHistory;
      });
      setHistoryIndex(i => Math.min(i + 1, MAX_HISTORY - 1));

      return next;
    });
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      setAdjustments({ ...history[newIdx] });
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      setAdjustments({ ...history[newIdx] });
    }
  }, [historyIndex, history]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const rawFiles = Array.from(event.target.files);
      // Process any RAW files
      const processedFiles = await Promise.all(rawFiles.map(async f => 
        isRawFile(f.name) ? await extractPreviewFromRaw(f) : f
      ));
      
      setFiles(prev => [...prev, ...processedFiles]);
      if (!currentFile && processedFiles.length > 0) {
        handleSelectFile(processedFiles[0]);
      }
    }
  };

  const handleAddFile = async (file: File) => {
    const processedFile = isRawFile(file.name) ? await extractPreviewFromRaw(file) : file;
    setFiles(prev => [...prev, processedFile]);
    handleSelectFile(processedFile);
  };

  const handleSelectFile = (file: File) => {
    setCurrentFile(file);
    const key = getFileKey(file);
    if (fileAdjustments[key]) {
      const saved = fileAdjustments[key];
      setAdjustments(saved);
      setHistory([saved]);
      setHistoryIndex(0);
    } else {
      setAdjustments({ ...DEFAULT_ADJUSTMENTS });
      setHistory([{ ...DEFAULT_ADJUSTMENTS }]);
      setHistoryIndex(0);
    }
  };

  const handleSyncToAll = useCallback(() => {
    if (!currentFile) return;
    const currentAdj = adjustments;
    const newDict = { ...fileAdjustments };
    files.forEach(f => {
      newDict[getFileKey(f)] = currentAdj;
    });
    setFileAdjustments(newDict);
  }, [currentFile, adjustments, files, fileAdjustments, getFileKey]);

  const handleExport = () => setExportModalOpen(true);

  // Mobile panel toggles
  const toggleMobileLibrary = () => setMobilePanel(p => p === 'library' ? null : 'library');
  const toggleMobileAdjustments = () => setMobilePanel(p => p === 'adjustments' ? null : 'adjustments');
  const toggleMobileTools = () => setMobilePanel(p => p === 'tools' ? null : 'tools');

  // Desktop panel toggles
  const toggleLeft = () => setLeftOpen(p => !p);
  const toggleRight = () => setRightOpen(p => !p);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--ux-bg-deep)' }}>
      {/* Header */}
      <Box ref={headerRef} sx={{ zIndex: 10, opacity: isMobile ? 1 : 0 }}>
        <Header
          onExport={handleExport}
          onToggleLeft={toggleLeft}
          onToggleRight={toggleRight}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          leftOpen={leftOpen}
          rightOpen={rightOpen}
          onShowInfo={() => setInfoModalOpen(true)}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flexGrow: 1, overflow: 'hidden', pb: isMobile ? '56px' : 0 }}>

        {/* Left Sidebar — Desktop/Tablet */}
        {!isMobile && leftOpen && (
          <Box
            ref={leftPanelRef}
            sx={{ display: 'flex', borderRight: '1px solid rgba(255,255,255,0.04)', flexShrink: 0 }}
          >
            <SidebarLeft
              files={files}
              onFileChange={handleFileChange}
              onSelectFile={handleSelectFile}
              onAddFile={handleAddFile}
              currentFile={currentFile}
            />
          </Box>
        )}

        {/* Toolbar */}
        {!isMobile && (
          <Toolbar toolState={toolState} setToolState={setToolState} />
        )}

        {/* Canvas */}
        <Box ref={canvasRef} sx={{ flexGrow: 1, display: 'flex', opacity: isMobile ? 1 : 0, minWidth: 0, minHeight: 0 }}>
          <CanvasArea currentFile={currentFile} adjustments={adjustments} toolState={toolState} />
        </Box>

        {/* Right Sidebar — Desktop/Tablet */}
        {!isMobile && rightOpen && (
          <Box
            ref={rightPanelRef}
            sx={{ display: 'flex', borderLeft: '1px solid rgba(255,255,255,0.04)', flexShrink: 0 }}
          >
            <SidebarRight
              adjustments={adjustments}
              onAdjustmentChange={handleAdjustmentChange}
              onResetAll={handleResetAll}
              onAutoEnhance={handleAutoEnhance}
              onSyncToAll={handleSyncToAll}
              onApplyPreset={handleApplyPreset}
            />
          </Box>
        )}
        
        {/* Mobile Bottom Adjustments Panel */}
        {isMobile && mobilePanel === 'adjustments' && (
          <Box
            sx={{
              height: '45vh',
              flexShrink: 0,
              background: 'rgba(10, 10, 18, 0.85)',
              backdropFilter: 'blur(24px)',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              overflow: 'hidden' // SidebarRight handles its own scrolling
            }}
          >
            <SidebarRight
              adjustments={adjustments}
              onAdjustmentChange={handleAdjustmentChange}
              onResetAll={handleResetAll}
              onAutoEnhance={handleAutoEnhance}
              onApplyPreset={handleApplyPreset}
            />
          </Box>
        )}

        {/* Mobile Bottom Tools Panel */}
        {isMobile && mobilePanel === 'tools' && (
          <Box
            sx={{
              height: '40vh',
              flexShrink: 0,
              background: 'rgba(10, 10, 18, 0.85)',
              backdropFilter: 'blur(24px)',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              overflow: 'hidden' 
            }}
          >
            <BrushPanel 
              toolState={toolState} 
              setToolState={setToolState} 
              isMobile={true}
            />
          </Box>
        )}
      </Box>

      {/* Mobile Drawers */}
      {isMobile && (
        <>
          <Drawer
            anchor="left" open={mobilePanel === 'library'} onClose={() => setMobilePanel(null)}
            PaperProps={{
              sx: {
                width: '85vw', maxWidth: 360, background: 'rgba(10, 10, 18, 0.95)',
                backdropFilter: 'blur(24px)', border: 'none',
              },
            }}
          >
            <SidebarLeft
              files={files}
              onFileChange={handleFileChange}
              onSelectFile={(file) => { handleSelectFile(file); setMobilePanel(null); }}
              currentFile={currentFile}
            />
          </Drawer>
        </>
      )}

      {/* Mobile Bottom Toolbar */}
      {isMobile && (
        <MobileToolbar
          activePanel={mobilePanel}
          onToggleLibrary={toggleMobileLibrary}
          onToggleAdjustments={toggleMobileAdjustments}
          onToggleTools={toggleMobileTools}
          onExport={handleExport}
        />
      )}

      {/* Export Modal */}
      <BulkExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        files={files}
        adjustments={adjustments}
      />

      {/* Info Modal */}
      <PhotoInfoModal
        open={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        file={currentFile}
      />
    </Box>
  );
}

export default App;
