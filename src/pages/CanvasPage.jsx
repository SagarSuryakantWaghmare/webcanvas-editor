import { useParams } from 'react-router-dom';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { saveCanvas, loadCanvas } from '../canvasService';
import Dock from '../components/Dock';

const CanvasPage = () => {
  // The useParams hook reads the dynamic part of the URL (the ":canvasId").
  const { canvasId } = useParams();
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [brushSize, setBrushSize] = useState(3);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const selectedToolRef = useRef('select');
  const selectedColorRef = useRef('#3b82f6');
  const brushSizeRef = useRef(3);

  const handleToolChange = useCallback((toolId) => {
    console.log('Switching to tool:', toolId);
    
    // Update state first
    setSelectedTool(toolId);
    selectedToolRef.current = toolId;
    
    // Handle canvas mode after state update
    if (fabricRef.current) {
      const canvas = fabricRef.current;
      
      if (toolId === 'pen') {
        // Enable drawing mode for pen
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.width = brushSizeRef.current;
        canvas.freeDrawingBrush.color = selectedColorRef.current;
        canvas.freeDrawingBrush.strokeLineCap = 'round';
        canvas.freeDrawingBrush.strokeLineJoin = 'round';
        canvas.selection = false;
        console.log('Pen mode enabled');
      } else {
        // Disable drawing mode for other tools
        canvas.isDrawingMode = false;
        canvas.selection = true;
        console.log('Drawing mode disabled');
      }
    }
    
    // Update cursor immediately
    if (fabricRef.current) {
      updateCanvasCursor(toolId);
    }
  }, []);

  const updateCanvasCursor = (tool) => {
    if (!fabricRef.current) return;
    
    const canvas = fabricRef.current;
    switch (tool) {
      case 'pen':
        canvas.defaultCursor = 'crosshair';
        canvas.hoverCursor = 'crosshair';
        canvas.moveCursor = 'crosshair';
        break;
      case 'text':
        canvas.defaultCursor = 'text';
        canvas.hoverCursor = 'text';
        break;
      case 'rectangle':
      case 'circle':
        canvas.defaultCursor = 'crosshair';
        canvas.hoverCursor = 'crosshair';
        break;
      default:
        canvas.defaultCursor = 'default';
        canvas.hoverCursor = 'move';
        canvas.moveCursor = 'move';
    }
  };

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    // Prevent multiple initializations
    if (fabricRef.current) return;

    let handleResize;

    try {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: width,
        height: height,
        backgroundColor: 'white',
        selection: true,
        preserveObjectStacking: true,
        enableRetinaScaling: false,
        renderOnAddRemove: true,
      });
      
      // Handle window resize
      handleResize = () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        canvas.setWidth(newWidth);
        canvas.setHeight(newHeight);
        canvas.renderAll();
      };
      
      window.addEventListener('resize', handleResize);
      
      console.log('Canvas initialized successfully');
      fabricRef.current = canvas;

    // Load existing canvas data
    const loadExistingCanvas = async () => {
      try {
        const canvasData = await loadCanvas(canvasId);
        if (canvasData && canvasData.canvasData && canvas) {
          canvas.loadFromJSON(canvasData.canvasData, () => {
            canvas.renderAll();
          });
        }
      } catch (error) {
        console.error('Error loading canvas:', error);
      }
    };

    loadExistingCanvas();

    // Canvas event listeners with current state
    const handleMouseDown = (options) => {
      const pointer = canvas.getPointer(options.e);
      const currentTool = selectedToolRef.current;
      const currentColor = selectedColorRef.current;
      
      if (currentTool === 'select') return;
      
      let shape = null;
      
      switch (currentTool) {
        case 'rectangle':
          shape = new fabric.Rect({
            left: pointer.x - 50,
            top: pointer.y - 40,
            width: 100,
            height: 80,
            fill: currentColor,
            stroke: '#333',
            strokeWidth: 2,
          });
          break;
          
        case 'circle':
          shape = new fabric.Circle({
            left: pointer.x - 50,
            top: pointer.y - 50,
            radius: 50,
            fill: currentColor,
            stroke: '#333',
            strokeWidth: 2,
          });
          break;
          
        case 'text':
          shape = new fabric.IText('Double click to edit', {
            left: pointer.x,
            top: pointer.y,
            fill: currentColor,
            fontSize: 24,
            fontFamily: 'Arial',
          });
          break;
          
        case 'pen':
          // Pen mode is handled in handleToolChange, just return here
          return;
      }
      
      if (shape) {
        canvas.add(shape);
        canvas.setActiveObject(shape);
        selectedToolRef.current = 'select';
        setSelectedTool('select');
        updateCanvasCursor('select');
        canvas.renderAll();
        setHasUnsavedChanges(true);
      }
    };

    const handleMouseUp = () => {
      // Don't disable drawing mode on mouse up for pen tool
      // Drawing mode should stay active while pen tool is selected
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:up', handleMouseUp);
    canvas.on('path:created', () => setHasUnsavedChanges(true));
    canvas.on('object:modified', () => setHasUnsavedChanges(true));
    canvas.on('text:changed', () => setHasUnsavedChanges(true));

      // Set initial cursor
      updateCanvasCursor(selectedToolRef.current);
      
    } catch (error) {
      console.error('Error initializing canvas:', error);
      // Reset canvas ref on error
      fabricRef.current = null;
    }

    return () => {
      if (handleResize) {
        window.removeEventListener('resize', handleResize);
      }
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
    };
  }, [canvasId]);

  // Update refs when state changes
  useEffect(() => {
    selectedToolRef.current = selectedTool;
    if (fabricRef.current) {
      updateCanvasCursor(selectedTool);
    }
  }, [selectedTool]);

  useEffect(() => {
    selectedColorRef.current = selectedColor;
    // Update pen brush color if currently in pen mode
    if (selectedTool === 'pen' && fabricRef.current && fabricRef.current.freeDrawingBrush) {
      fabricRef.current.freeDrawingBrush.color = selectedColor;
    }
    
    // Also update selected object color if there's an active object
    if (fabricRef.current) {
      const activeObject = fabricRef.current.getActiveObject();
      if (activeObject && selectedTool === 'select') {
        if (activeObject.type === 'i-text' || activeObject.type === 'text') {
          activeObject.set('fill', selectedColor);
        } else if (activeObject.type === 'path') {
          activeObject.set('stroke', selectedColor);
        } else {
          activeObject.set('fill', selectedColor);
        }
        fabricRef.current.renderAll();
      }
    }
  }, [selectedColor, selectedTool]);

  // Update brush size
  useEffect(() => {
    brushSizeRef.current = brushSize;
    // Update pen brush size if currently in pen mode
    if (selectedTool === 'pen' && fabricRef.current && fabricRef.current.freeDrawingBrush) {
      fabricRef.current.freeDrawingBrush.width = brushSize;
      console.log('Brush size updated:', brushSize);
    }
  }, [brushSize, selectedTool]);

  const handleSave = useCallback(async (isAutosave = false) => {
    if (!fabricRef.current) return;
    
    setIsSaving(true);
    try {
      const canvasData = JSON.stringify(fabricRef.current.toJSON());
      await saveCanvas(canvasId, canvasData);
      setHasUnsavedChanges(false);
      if (!isAutosave) {
        showToast('Canvas saved successfully!', 'success');
      }
    } catch (error) {
      console.error('Error saving canvas:', error);
      showToast('Failed to save canvas. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [canvasId]);

  const deleteSelected = () => {
    if (!fabricRef.current) return;
    
    const canvas = fabricRef.current;
    try {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.remove(activeObject);
        canvas.renderAll();
        setHasUnsavedChanges(true);
      }
    } catch (error) {
      console.error('Error deleting object:', error);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const clearCanvas = useCallback(() => {
    if (!fabricRef.current) return;
    
    const canvas = fabricRef.current;
    canvas.clear();
    canvas.setBackgroundColor('white', canvas.renderAll.bind(canvas));
    setHasUnsavedChanges(true);
    setShowClearModal(false);
    showToast('Canvas cleared successfully!', 'success');
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      // Handle Ctrl key combinations
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            handleSave();
            showToast('Canvas saved with Ctrl+S!', 'success');
            break;
          case 'd':
            e.preventDefault();
            // Download canvas
            if (fabricRef.current) {
              const dataURL = fabricRef.current.toDataURL({
                format: 'png',
                quality: 1,
                multiplier: 2
              });
              const link = document.createElement('a');
              link.download = `canvas-${canvasId}.png`;
              link.href = dataURL;
              link.click();
              showToast('Canvas downloaded with Ctrl+D!', 'success');
            }
            break;
          case 'k':
            e.preventDefault();
            setShowClearModal(true);
            break;
        }
        return;
      }
      
      // Handle single key shortcuts
      switch (e.key.toLowerCase()) {
        case 'v':
          handleToolChange('select');
          showToast('Select tool activated (V)', 'success');
          break;
        case 'r':
          handleToolChange('rectangle');
          showToast('Rectangle tool activated (R)', 'success');
          break;
        case 'c':
          handleToolChange('circle');
          showToast('Circle tool activated (C)', 'success');
          break;
        case 't':
          handleToolChange('text');
          showToast('Text tool activated (T)', 'success');
          break;
        case 'p':
          handleToolChange('pen');
          showToast('Pencil tool activated (P)', 'success');
          break;
        case '?':
        case '/':
          e.preventDefault();
          setShowShortcuts(!showShortcuts);
          break;
        case 'escape':
          setShowShortcuts(false);
          break;
        case 'delete':
        case 'backspace':
          e.preventDefault();
          deleteSelected();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleToolChange, handleSave, canvasId, showShortcuts, clearCanvas]);

  // Autosave functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasUnsavedChanges && fabricRef.current) {
        handleSave(true); // true indicates autosave
      }
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [hasUnsavedChanges, handleSave]);

  const dockItems = [
    {
      label: 'Select',
      tooltip: 'Select Tool (V)',
      shortcut: 'V',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
          <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 17L12 22L21 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      onClick: () => handleToolChange('select'),
      className: selectedTool === 'select' ? 'bg-orange-500 border-orange-300' : ''
    },
    {
      label: 'Rectangle',
      tooltip: 'Rectangle Tool (R)',
      shortcut: 'R',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      onClick: () => handleToolChange('rectangle'),
      className: selectedTool === 'rectangle' ? 'bg-orange-500 border-orange-300' : ''
    },
    {
      label: 'Circle',
      tooltip: 'Circle Tool (C)',
      shortcut: 'C',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      onClick: () => handleToolChange('circle'),
      className: selectedTool === 'circle' ? 'bg-orange-500 border-orange-300' : ''
    },
    {
      label: 'Pencil',
      tooltip: 'Pencil Tool (P)',
      shortcut: 'P',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
          <path d="M12 19L7 14L16.5 4.5C17.28 3.72 18.72 3.72 19.5 4.5C20.28 5.28 20.28 6.72 19.5 7.5L12 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 8L2 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.5 15H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      onClick: () => handleToolChange('pen'),
      className: selectedTool === 'pen' ? 'bg-orange-500 border-orange-300' : ''
    },
    {
      label: 'Text',
      tooltip: 'Text Tool (T)',
      shortcut: 'T',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
          <polyline points="4,7 4,4 20,4 20,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="9" y1="20" x2="15" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      onClick: () => handleToolChange('text'),
      className: selectedTool === 'text' ? 'bg-orange-500 border-orange-300' : ''
    },
    {
      label: 'Save',
      tooltip: 'Save Canvas (Ctrl+S)',
      shortcut: 'Ctrl+S',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
          <path d="M19 21H5C3.89 21 3 20.11 3 19V5C3 3.89 3.89 3 5 3H16L21 8V19C21 20.11 20.11 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      onClick: handleSave,
      className: isSaving ? 'bg-green-500' : ''
    },
    {
      label: 'Download',
      tooltip: 'Download Canvas (Ctrl+D)',
      shortcut: 'Ctrl+D',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
          <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      onClick: () => {
        if (!fabricRef.current) return;
        const dataURL = fabricRef.current.toDataURL({
          format: 'png',
          quality: 1,
          multiplier: 2
        });
        const link = document.createElement('a');
        link.download = `canvas-${canvasId}.png`;
        link.href = dataURL;
        link.click();
        showToast('Canvas downloaded successfully!', 'success');
      },
      className: ''
    },
    {
      label: 'Delete',
      tooltip: 'Delete Selected Item (Del)',
      shortcut: 'Del',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
          <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      onClick: () => {
        deleteSelected();
        showToast('Selected item deleted!', 'success');
      },
      className: ''
    },
    {
      label: 'Clear',
      tooltip: 'Clear Canvas (Ctrl+K)',
      shortcut: 'Ctrl+K',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      onClick: () => {
        setShowClearModal(true);
      },
      className: ''
    }
  ];

  return (

    <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Top left: Logo, branding, color picker, brush controls */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex flex-col items-start space-y-4">
        <div className="flex items-center space-x-2">
          <div className="bg-orange-500 rounded-lg p-2">
            <svg width="24" height="24" className="text-white" viewBox="0 0 24 24" fill="none">
              <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z" fill="currentColor"/>
            </svg>
          </div>
          <span className="font-bold text-xl text-gray-900">
            <span className="hidden xs:inline">WebCanvas Editor</span>
            <span className="xs:hidden">WebCanvas</span>
          </span>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200 mt-2">
          <div className="flex flex-col space-y-2">
            {['#EF7722', '#F4B942', '#E5E7EB', '#0EA5E9', '#10b981', '#ef4444', '#8b5cf6', '#000000'].map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  selectedColor === color ? 'border-gray-800 scale-110' : 'border-gray-300 hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-6 h-6 rounded border-0 cursor-pointer mt-2"
            />
          </div>
        </div>
        {selectedTool === 'pen' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200 mt-2">
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">Brush:</label>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-20 h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 bg-orange-100 px-2 py-1 rounded">{brushSize}px</span>
            </div>
          </div>
        )}
      </div>

      {/* Top right: Share and GitHub star */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex flex-col xs:flex-row items-end xs:items-center space-y-2 xs:space-y-0 xs:space-x-3">
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium shadow transition-all duration-200 hover:scale-105"
        >
          Share
        </button>
        <button
          onClick={() => window.open('https://github.com/SagarSuryakantWaghmare/webcanvas-editor', '_blank')}
          className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-xl font-medium shadow flex items-center space-x-2 transition-all duration-200 hover:scale-105"
        >
          <svg width="20" height="20" className="text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span className="hidden xs:inline">Star on GitHub</span>
          <span className="xs:hidden">Star</span>
        </button>
      </div>

      <div className="fixed inset-0 z-0">
        <canvas
          ref={canvasRef}
          className={`w-full h-full transition-all duration-300 ${
            selectedTool === 'pen'
              ? 'cursor-crosshair'
              : 'cursor-default'
          }`}
          style={{ display: 'block', width: '100vw', height: '100vh' }}
        />
      </div>

      <Dock
        items={dockItems}
        className="bg-black/80 backdrop-blur-lg"
        magnification={70}
        distance={200}
        panelHeight={64}
        baseItemSize={50}
      />

      {/* Toast Notifications */}
      {toast.show && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Save Status - Bottom Right */}
      <div className="fixed lg:bottom-6 bottom-30 right-6 z-10">
        <div className={`px-4 py-2 rounded-xl shadow-lg transition-all duration-300 ${
          isSaving 
            ? 'bg-blue-500 text-white' 
            : hasUnsavedChanges 
            ? 'bg-orange-500 text-white' 
            : 'bg-green-500 text-white'
        }`}>
          {isSaving ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Saving...</span>
            </div>
          ) : hasUnsavedChanges ? (
            <span className="text-sm font-medium">Unsaved changes</span>
          ) : (
            <span className="text-sm font-medium">All changes saved</span>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts Help Panel */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Keyboard Shortcuts</h3>
              <button
                onClick={() => setShowShortcuts(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Select Tool</span>
                  <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">V</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Rectangle Tool</span>
                  <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">R</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Circle Tool</span>
                  <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">C</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Pencil Tool</span>
                  <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">P</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Text Tool</span>
                  <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">T</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Save Canvas</span>
                  <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl+S</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Download Canvas</span>
                  <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl+D</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Delete Selected</span>
                  <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Del</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Clear Canvas</span>
                  <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl+K</kbd>
                </div>
              </div>
              <div className="border-t pt-3 mt-4">
                <div className="flex justify-between text-sm">
                  <span>Show/Hide Shortcuts</span>
                  <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">?</kbd>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>Close Help</span>
                  <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Esc</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Button - Bottom Left */}
      <div className="fixed lg:bottom-6 bottom-30 left-6 z-10">
        <button
          onClick={() => setShowShortcuts(!showShortcuts)}
          className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          title="Keyboard Shortcuts (?)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M9.09 9A3 3 0 0 1 12 6C13.6569 6 15 7.34315 15 9C15 10.6569 13.6569 12 12 12V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Clear Canvas Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-red-600">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Clear Canvas</h3>
              <p className="text-gray-600">
                Are you sure you want to clear the entire canvas? This action cannot be undone and all your work will be lost.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={clearCanvas}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Clear Canvas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasPage;
