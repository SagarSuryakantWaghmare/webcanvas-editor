import { collection, addDoc, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
export async function createCanvas() {
  try {
    const docRef = await addDoc(collection(db, 'canvases'), {
      canvasData: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating canvas:', error);
    throw error;
  }
}

export async function saveCanvas(canvasId, canvasData) {
  try {
    const canvasRef = doc(db, 'canvases', canvasId);
    await setDoc(canvasRef, {
      canvasData: canvasData,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving canvas:', error);
    throw error;
  }
}

export async function loadCanvas(canvasId) {
  try {
    const canvasRef = doc(db, 'canvases', canvasId);
    const canvasSnap = await getDoc(canvasRef);
    
    if (canvasSnap.exists()) {
      return canvasSnap.data();
    } else {
      console.warn('Canvas not found');
      return null;
    }
  } catch (error) {
    console.error('Error loading canvas:', error);
    throw error;
  }
}