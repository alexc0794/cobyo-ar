import React, {useEffect} from 'react';
import axios from 'axios'
import { loadTrack } from './Track';
import { BASE_API_URL } from './config';
import './App.css';


function App() {
  useEffect(() => {
    listenToMarker();
  });

  function listenToMarker() {
    const marker = document.getElementById('marker');
    marker.addEventListener('markerFound', handleMarkerFound);
    marker.addEventListener('markerLost', handleMarkerLost);
  }

  let startX = 0;
  let distance = 0;
  const SWIPE_DISTANCE_THRESHOLD = window.innerWidth - 100;

  function handleTouchStart(e) {
    const touch = e.changedTouches[0];
    startX = parseInt(touch.clientX);
    e.preventDefault();
  }

  function handleTouchMove(e) {
    const touch = e.changedTouches[0];
    distance = parseInt(touch.clientX) - startX;
    const primaryImageElement = document.getElementById('primary-image');
    primaryImageElement.setAttribute('opacity', (SWIPE_DISTANCE_THRESHOLD - Math.abs(distance)) / SWIPE_DISTANCE_THRESHOLD);
    e.preventDefault();
  }

  async function handleTouchEnd(e) {
    if (distance < -1 * SWIPE_DISTANCE_THRESHOLD) { // Swipe right is negative
      try {
        await axios.get(`${BASE_API_URL}/next`);
        const primaryImageElement = document.getElementById('primary-image');
        primaryImageElement.setAttribute('animation', 'loop', true);
        primaryImageElement.emit('rotate');
        setTimeout(async () => {
          await loadTrack();
          primaryImageElement.setAttribute('rotation', {x: 0, y: 0, z: 0});
          primaryImageElement.setAttribute('animation', 'loop', false);
        }, 2500);
      } catch(e) {
        console.warn(e);
      }
    }
    const primaryImageElement = document.getElementById('primary-image');
    primaryImageElement.setAttribute('opacity', 1);
    startX = 0;
    distance = 0;
    e.preventDefault();
  }

  async function handleMarkerFound() {
    loadTrack();
    const scene = document.getElementById('scene');
    scene.addEventListener('touchstart', handleTouchStart);
    scene.addEventListener('touchmove', handleTouchMove);
    scene.addEventListener('touchend', handleTouchEnd);
  }

  function handleMarkerLost() {
    const scene = document.getElementById('scene');
    scene.removeEventListener('touchstart', handleTouchStart);
    scene.removeEventListener('touchmove', handleTouchMove);
    scene.removeEventListener('touchend', handleTouchEnd);
  }

  return (
    <div className="App">
      <h1>Cobyo AR</h1>
    </div>
  );
}

export default App;
