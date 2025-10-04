import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Make sure the path to firebase.js is correct
import React from 'react';
const HomePage = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCanvas = async () => {
    setIsCreating(true);
    try {
      // 1. Create a new document in the "canvases" collection in Firestore.
      const docRef = await addDoc(collection(db, "canvases"), {
        canvasJSON: '{}' // Initialize with an empty canvas state.
      });

      // 2. Use the new document's ID to navigate to the canvas editor page.
      navigate(`/canvas/${docRef.id}`);

    } catch (e) {
      console.error("Error creating new canvas: ", e);
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
