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
      <div className="relative z-10 max-w-7xl my-8 sm:my-12 mx-auto px-4 sm:px-6 text-center">
        {/* Main Heading */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-2 sm:mb-4 leading-tight">
            CREATE AMAZING
          </h1>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold text-orange-500 leading-tight">
            CANVAS DESIGNS
          </h2>
        </div>
        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
          A powerful and intuitive 2D canvas editor with real-time collaboration. 
          Draw, design, and bring your creative ideas to life with professional tools.
        </p>
       
        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-lg mx-auto">
          <button
            onClick={handleCreateCanvas}
            disabled={isCreating}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg"
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
          <a
            href="https://github.com/SagarSuryakantWaghmare"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg border-2 border-gray-300 transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2 sm:space-x-3 shadow-md"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-gray-900">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>View My GitHub Profile</span>
          </a>
        </div>
      </div>
      
      
    </section>
  );
};

export default HeroSection;