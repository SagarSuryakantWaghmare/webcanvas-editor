import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { saveCanvas, loadCanvas } from '../canvasService';

const CanvasPage = () => {
  // The useParams hook reads the dynamic part of the URL (the ":canvasId").
  const { canvasId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [brushSize, setBrushSize] = useState(2);
  const [isSaving, setIsSaving] = useState(false);
  const selectedToolRef = useRef('select');
  const selectedColorRef = useRef('#3b82f6');
  const brushSizeRef = useRef(2);

  const handleToolChange = useCallback((toolId) => {
    // If switching away from pen mode, disable drawing mode
    if (selectedToolRef.current === 'pen' && fabricRef.current) {
      fabricRef.current.isDrawingMode = false;
    }
    
    setSelectedTool(toolId);
    selectedToolRef.current = toolId;
    
    // If switching to pen mode, set up the brush immediately
    if (toolId === 'pen' && fabricRef.current) {
      fabricRef.current.isDrawingMode = true;
      fabricRef.current.freeDrawingBrush = new fabric.PencilBrush(fabricRef.current);
      fabricRef.current.freeDrawingBrush.width = brushSizeRef.current;
      fabricRef.current.freeDrawingBrush.color = selectedColorRef.current;
      fabricRef.current.freeDrawingBrush.strokeLineCap = 'round';
      fabricRef.current.freeDrawingBrush.strokeLineJoin = 'round';
      fabricRef.current.freeDrawingBrush.decimate = 0.4;
    }
    
    // Update cursor immediately
    if (fabricRef.current) {
      updateCanvasCursor(toolId);
    }
  }, []);

  const updateCanvasCursor = (tool) => {
    if (!fabricRef.current) return;
    
    switch (tool) {
      case 'pen':
        fabricRef.current.defaultCursor = 'crosshair';
        fabricRef.current.hoverCursor = 'crosshair';
        fabricRef.current.moveCursor = 'crosshair';
        break;
      case 'text':
        fabricRef.current.defaultCursor = 'text';
        fabricRef.current.hoverCursor = 'text';
        break;
      case 'rectangle':
      case 'circle':
        fabricRef.current.defaultCursor = 'crosshair';
        fabricRef.current.hoverCursor = 'crosshair';
        break;
      default:
        fabricRef.current.defaultCursor = 'default';
        fabricRef.current.hoverCursor = 'move';
        fabricRef.current.moveCursor = 'move';
    }
  };

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: 'white',
      selection: true,
      preserveObjectStacking: true,
    });

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
          // Pen mode is already set up in handleToolChange, just ensure it's active
          if (!canvas.isDrawingMode) {
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.freeDrawingBrush.width = brushSizeRef.current;
            canvas.freeDrawingBrush.color = currentColor;
            canvas.freeDrawingBrush.strokeLineCap = 'round';
            canvas.freeDrawingBrush.strokeLineJoin = 'round';
            canvas.freeDrawingBrush.decimate = 0.4;
          }
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
      if (selectedToolRef.current === 'pen') {
        canvas.isDrawingMode = false;
      }
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:up', handleMouseUp);

    // Set initial cursor
    updateCanvasCursor(selectedToolRef.current);

    return () => {
      canvas.dispose();
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
  }, [selectedColor, selectedTool]);

  useEffect(() => {
    brushSizeRef.current = brushSize;
    // Update pen brush size if currently in pen mode
    if (selectedTool === 'pen' && fabricRef.current && fabricRef.current.freeDrawingBrush) {
      fabricRef.current.freeDrawingBrush.width = brushSize;
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
    const canvas = fabricRef.current;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  };

  const clearCanvas = () => {
    if (window.confirm('Are you sure you want to clear the entire canvas?')) {
      fabricRef.current.clear();
      fabricRef.current.backgroundColor = 'white';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Home
            </button>
            <h1 className="text-xl font-semibold">Canvas Editor</h1>
            <span className="text-sm text-gray-500 font-mono">ID: {canvasId}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Toolbar */}
        <div className="w-64 bg-white shadow-lg p-4 space-y-4">
          <div>
            <h3 className="font-medium text-gray-700 mb-3">Tools</h3>
            <div className="space-y-2">
              {[
                { id: 'select', label: 'Select', icon: '👆', shortcut: 'V' },
                { id: 'rectangle', label: 'Rectangle', icon: '▭', shortcut: 'R' },
                { id: 'circle', label: 'Circle', icon: '○', shortcut: 'C' },
                { id: 'text', label: 'Text', icon: 'T', shortcut: 'T' },
                { id: 'pen', label: 'Pencil', icon: '✎', shortcut: 'P' },
              ].map(tool => (
                <button
                  key={tool.id}
                  onClick={() => handleToolChange(tool.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    selectedTool === tool.id
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <span className="text-lg">{tool.icon}</span>
                  <div className="flex flex-col items-start">
                    <span>{tool.label}</span>
                    <span className="text-xs opacity-60">({tool.shortcut})</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-3">Color</h3>
            <div className="flex flex-wrap gap-2">
              {[
                '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
                '#8b5cf6', '#ec4899', '#6b7280', '#000000'
              ].map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-lg border-2 ${
                    selectedColor === color ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="mt-2 w-full h-8 rounded border"
            />
          </div>

          <div className={selectedTool === 'pen' ? 'block' : 'hidden'}>
            <h3 className="font-medium text-gray-700 mb-3">✎ Pencil Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="flex items-center justify-between text-sm mb-1">
                  <span>Brush Size:</span>
                  <span className="font-medium bg-blue-100 px-2 py-1 rounded text-blue-800">{brushSize}px</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Fine (1px)</span>
                  <span>Thick (20px)</span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700 font-medium mb-1">💡 Pencil Tips:</p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• Press and drag to draw smoothly</li>
                  <li>• Adjust brush size while drawing</li>
                  <li>• Change colors instantly</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-3">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={deleteSelected}
                className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Delete Selected
              </button>
              <button
                onClick={clearCanvas}
                className="w-full px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
              >
                Clear Canvas
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-3">Tips</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• Click shapes to select and move</p>
              <p>• Double-click text to edit</p>
              <p>• Use keyboard shortcuts (V, R, C, T, P)</p>
              <p>• Pencil tool: Press P or click ✎ to draw</p>
              <p>• Delete key removes selected objects</p>
              <p>• Save regularly to preserve your work</p>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className={`bg-white rounded-lg shadow-lg p-4 transition-all duration-200 ${
            selectedTool === 'pen' ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
          }`}>
            {selectedTool === 'pen' && (
              <div className="mb-2 text-center">
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                  ✎ Pencil Mode Active - Draw freely!
                </span>
              </div>
            )}
            <canvas
              ref={canvasRef}
              className={`border rounded transition-all duration-200 ${
                selectedTool === 'pen' 
                  ? 'border-blue-400 border-2 shadow-blue-100 shadow-lg' 
                  : 'border-gray-300'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasPage;
