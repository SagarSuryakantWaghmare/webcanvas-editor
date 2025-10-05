import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCanvas } from '../canvasService';

const HeroSection = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  // Check for existing canvas in localStorage on component mount
  useEffect(() => {
    const existingCanvasId = localStorage.getItem('currentCanvasId');
    if (existingCanvasId) {
      navigate(`/canvas/${existingCanvasId}`);
    }
  }, [navigate]);

  const handleCreateCanvas = async () => {
    setIsCreating(true);
    try {
      const canvasId = await createCanvas();
      // Save canvas ID to localStorage
      localStorage.setItem('currentCanvasId', canvasId);
      navigate(`/canvas/${canvasId}`);
    } catch (error) {
      console.error("Error creating new canvas: ", error);
      alert("Failed to create a new canvas. Please try again.");
      setIsCreating(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white">
      {/* Simple Pattern Background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gray-50">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E5E7EB" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />
          </svg>
        </div>
      </div>
      {/* Content */}
      <div className="relative z-10 max-w-7xl my-12 mx-auto px-6 text-center">
        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 leading-tight">
            CREATE AMAZING
          </h1>
          <h2 className="text-5xl md:text-7xl font-bold text-orange-500 leading-tight">
            CANVAS DESIGNS
          </h2>
        </div>
        {/* Subtitle */}
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          A powerful and intuitive 2D canvas editor with real-time collaboration. 
          Draw, design, and bring your creative ideas to life with professional tools.
        </p>
       
        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleCreateCanvas}
            disabled={isCreating}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center space-x-3 shadow-lg"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Creating Canvas...</span>
              </>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
                </svg>
                <span>Start Creating Now</span>
              </>
            )}
          </button>
          <button className="bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-300 transition-all duration-200 hover:scale-105 flex items-center space-x-3 shadow-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-500">
              <path d="M8 5v14l11-7z" fill="currentColor"/>
            </svg>
            <span>See Features</span>
          </button>
        </div>
      </div>
      
      
    </section>
  );
};

export default HeroSection;