import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCanvas } from '../canvasService';

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
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">
        Welcome to WebCanvas
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        A simple and intuitive 2D canvas editor. Click the button below to start creating your masterpiece.
      </p>
      <button
        onClick={handleCreateCanvas}
        disabled={isCreating}
        className="px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isCreating ? 'Creating...' : 'Create a New Canvas'}
      </button>
    </div>
  );
};

export default HomePage;
