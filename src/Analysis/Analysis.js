import { useEffect } from 'react';
import { fetchRecentlyPlayedAnalysis } from './services/recentlyPlayedService';

function Analysis() {
  const analysisElement = document.getElementById('analysis');

  useEffect(() => {
    listenToMarker();
  });

  function listenToMarker() {
    const marker = document.getElementById('marker');
    marker.addEventListener('markerFound', handleMarkerFound);
    // marker.addEventListener('markerLost', handleMarkerLost);
  }

  function handleMarkerFound() {
    analysisElement.setAttribute('visible', true);
    loadRecentlyPlayedAnalysis();
  }


  async function loadRecentlyPlayedAnalysis() {
    const PROPERTY_COLOR = {
      danceability: 'orange',
      energy: 'green',
      loudness: 'purple',
      speechiness: 'yellow',
      acousticness: 'brown',
      instrumentalness: 'silver',
      liveness: 'blue',
      valence: 'pink',
      tempo: 'red',
    };
    const response = await fetchRecentlyPlayedAnalysis();
    const analysis = response.data;
    let y = 2;
    Object.keys(analysis).forEach(key => {
      const propertyElement = document.createElement('a-plane');
      propertyElement.setAttribute('id', `analysis-${key}`);
      propertyElement.setAttribute('position', {
        x: 0,
        y,
        z: 0,
      });
      y -= .5
      propertyElement.setAttribute('color', PROPERTY_COLOR[key]);
      propertyElement.setAttribute('height', .25);
      propertyElement.setAttribute('width', 2);
      propertyElement.setAttribute('text', `value: ${key}: ${analysis[key]}`);
      propertyElement.setAttribute('animation', {
        property: 'object3D.scale.y',
        to: 1,
        dur: 750,
        delay: 500,
      })
      analysisElement.appendChild(propertyElement);
    });
  }

  return null;
}

export default Analysis;
