import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
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
  const [isSaving, setIsSaving] = useState(false);

  const loadExistingCanvas = async () => {
    try {
      const canvasData = await loadCanvas(canvasId);
      if (canvasData && canvasData.canvasData && fabricRef.current) {
        fabricRef.current.loadFromJSON(canvasData.canvasData, () => {
          fabricRef.current.renderAll();
        });
      }
    } catch (error) {
      console.error('Error loading canvas:', error);
    }
  };

  const handleMouseDown = (options) => {
    const canvas = fabricRef.current;
    const pointer = canvas.getPointer(options.e);
    
    if (selectedTool === 'select') return;
    
    let shape = null;
    
    switch (selectedTool) {
      case 'rectangle':
        shape = new fabric.Rect({
          left: pointer.x,
          top: pointer.y,
          width: 100,
          height: 80,
          fill: selectedColor,
          stroke: '#000',
          strokeWidth: 1,
        });
        break;
        
      case 'circle':
        shape = new fabric.Circle({
          left: pointer.x,
          top: pointer.y,
          radius: 50,
          fill: selectedColor,
          stroke: '#000',
          strokeWidth: 1,
        });
        break;
        
      case 'text':
        shape = new fabric.IText('Click to edit', {
          left: pointer.x,
          top: pointer.y,
          fill: selectedColor,
          fontSize: 20,
          fontFamily: 'Arial',
        });
        break;
        
      case 'pen':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = 2;
        canvas.freeDrawingBrush.color = selectedColor;
        return;
    }
    
    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
      setSelectedTool('select');
    }
  };

  const handleMouseUp = () => {
    if (selectedTool === 'pen' && fabricRef.current) {
      fabricRef.current.isDrawingMode = false;
    }
  };

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: 'white',
    });

    fabricRef.current = canvas;

    // Load existing canvas data
    loadExistingCanvas();

    // Canvas event listeners
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:up', handleMouseUp);

    return () => {
      canvas.dispose();
    };
  }, [canvasId]); // eslint-disable-line react-hooks/exhaustive-deps

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
                { id: 'select', label: 'Select', icon: '👆' },
                { id: 'rectangle', label: 'Rectangle', icon: '▭' },
                { id: 'circle', label: 'Circle', icon: '○' },
                { id: 'text', label: 'Text', icon: 'T' },
                { id: 'pen', label: 'Pen', icon: '✏️' },
              ].map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    selectedTool === tool.id
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <span className="text-lg">{tool.icon}</span>
                  <span>{tool.label}</span>
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
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <canvas
              ref={canvasRef}
              className="border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasPage;
