import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { saveCanvas, loadCanvas } from '../canvasService';
import Dock from '../components/Dock';

const CanvasPage = () => {
  // The useParams hook reads the dynamic part of the URL (the ":canvasId").
  const { canvasId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [brushSize, setBrushSize] = useState(3);
  const [isSaving, setIsSaving] = useState(false);
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
      }
    };

    const handleMouseUp = () => {
      // Don't disable drawing mode on mouse up for pen tool
      // Drawing mode should stay active while pen tool is selected
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:up', handleMouseUp);

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch (e.key) {
        case 'v':
        case 'V':
          handleToolChange('select');
          break;
        case 'r':
        case 'R':
          handleToolChange('rectangle');
          break;
        case 'c':
        case 'C':
          handleToolChange('circle');
          break;
        case 't':
        case 'T':
          handleToolChange('text');
          break;
        case 'p':
        case 'P':
          handleToolChange('pen');
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          deleteSelected();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleToolChange]);

  const handleSave = async () => {
    if (!fabricRef.current) return;
    
    setIsSaving(true);
    try {
      const canvasData = JSON.stringify(fabricRef.current.toJSON());
      await saveCanvas(canvasId, canvasData);
      alert('Canvas saved successfully!');
    } catch (error) {
      console.error('Error saving canvas:', error);
      alert('Failed to save canvas. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteSelected = () => {
    if (!fabricRef.current) return;
    
    const canvas = fabricRef.current;
    try {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.remove(activeObject);
        canvas.renderAll();
      }
    } catch (error) {
      console.error('Error deleting object:', error);
    }
  };



  const dockItems = [
    {
      label: 'Website name',
      icon: (
        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          WC
        </div>
      ),
      onClick: () => navigate('/'),
      className: 'bg-gradient-to-br from-orange-400 to-orange-500'
    },
    {
      label: 'Select',
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
      },
      className: ''
    },
    {
      label: 'GitHub',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      onClick: () => window.open('https://github.com/SagarSuryakantWaghmare/webcanvas-editor', '_blank'),
      className: ''
    }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200">
          <h1 className="text-lg font-bold text-gray-900">WebCanvas Editor</h1>
          <p className="text-xs text-gray-500 font-mono">Canvas ID: {canvasId}</p>
        </div>
      </div>

      <div className="absolute top-6 right-6 z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">Color:</label>
              <div className="flex space-x-2">
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
              </div>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-6 h-6 rounded border-0 cursor-pointer"
              />
            </div>
          </div>
          {selectedTool === 'pen' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200">
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
    </div>
  );
};

export default CanvasPage;
