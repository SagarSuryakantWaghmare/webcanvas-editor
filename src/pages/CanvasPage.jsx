import { useParams } from 'react-router-dom';
import React from 'react';
const CanvasPage = () => {
  // The useParams hook reads the dynamic part of the URL (the ":canvasId").
  const { canvasId } = useParams();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Canvas Editor</h1>
      <p className="text-gray-700">
        You are editing the canvas with ID:
      </p>
      <p className="text-lg font-mono bg-gray-200 px-3 py-1 mt-2 rounded">
        {canvasId}
      </p>
    </div>
  );
};

export default CanvasPage;
