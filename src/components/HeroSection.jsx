import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hyperspeed from './Hyperspeed';
import GradientText from './GradientText';
import { createCanvas } from '../canvasService';

const HeroSection = () => {
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Hyperspeed Animation */}
      <div className="absolute inset-0 w-full h-full">
        <Hyperspeed
          effectOptions={{
            onSpeedUp: () => {},
            onSlowDown: () => {},
            distortion: 'turbulentDistortion',
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 4,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 20,
            lightPairsPerRoadWay: 40,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [400 * 0.03, 400 * 0.2],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.8, 0.8],
            carFloorSeparation: [0, 5],
            colors: {
              roadColor: 0xffffff,
              islandColor: 0xf8f9fa,
              background: 0xffffff,
              shoulderLines: 0xe5e7eb,
              brokenLines: 0xe5e7eb,
              leftCars: [0x3b82f6, 0x1d4ed8, 0x1e40af],
              rightCars: [0x06b6d4, 0x0891b2, 0x0e7490],
              sticks: 0x6b7280
            }
          }}
        />
      </div>
      {/* Content */}
      <div className="relative z-10 max-w-7xl my-12 mx-auto px-6 text-center">
        {/* Main Heading with Gradient Text Animation */}
        <div className="mb-8">
          <GradientText
            colors={['#374151', '#111827', '#6b7280']}
            animationSpeed={6}
            showBorder={false}
            className="text-5xl md:text-7xl font-bold mb-4"
          >
            CREATE AMAZING
          </GradientText>
          <GradientText
            colors={['#3b82f6', '#1d4ed8', '#06b6d4']}
            animationSpeed={8}
            showBorder={false}
            className="text-5xl md:text-7xl font-bold"
          >
            CANVAS DESIGNS
          </GradientText>
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
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center space-x-3"
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
          <button className="bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-200 transition-all duration-200 hover:scale-105 flex items-center space-x-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-600">
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