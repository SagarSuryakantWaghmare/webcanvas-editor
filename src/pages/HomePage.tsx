import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCanvas } from '../canvasService';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const HomePage = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCanvas = async () => {
    setIsCreating(true);
    try {
      const canvasId = await createCanvas();
      navigate(`/canvas/${canvasId}`);
    } catch (error) {
      console.error("Error creating new canvas: ", error);
      alert("Failed to create a new canvas. Please try again.");
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-lg shadow-xl border-0 bg-white/80 backdrop-blur">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-4xl font-bold text-slate-800 mb-2">
            🎨 WebCanvas
          </CardTitle>
          <CardDescription className="text-lg text-slate-600">
            A simple and intuitive 2D canvas editor
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pt-4">
          <p className="text-slate-600 mb-8">
            Create, draw, and design with powerful tools. Start building your masterpiece today!
          </p>
          <Button
            onClick={handleCreateCanvas}
            disabled={isCreating}
            size="lg"
            className="w-full py-6 text-lg font-semibold shadow-lg"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Canvas...
              </>
            ) : (
              <>
                🚀 Create a New Canvas
              </>
            )}
          </Button>
          
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="p-3">
              <div className="text-2xl mb-1">✏️</div>
              <p className="text-xs text-slate-500">Draw</p>
            </div>
            <div className="p-3">
              <div className="text-2xl mb-1">🎨</div>
              <p className="text-xs text-slate-500">Design</p>
            </div>
            <div className="p-3">
              <div className="text-2xl mb-1">💾</div>
              <p className="text-xs text-slate-500">Save</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
