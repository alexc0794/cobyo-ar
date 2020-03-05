import React, {useEffect} from 'react';
import axios from 'axios'
import './App.css';

// const BASE_API_URL = 'http://localhost:8080';
const BASE_API_URL = 'https://f3mf794ytg.execute-api.us-east-1.amazonaws.com/dev';

function App() {
  let pressTimeout = null;

  async function fetchCurrentlyPlaying() {
    let response = null;
    try {
      response = await axios.get(`${BASE_API_URL}/currently-playing`, {
        user_id: 'user1'
      });
    } catch(e) {
      console.warn(e);
    }

    if (response && response.data && response.data.error) {
      const primaryTextElement = document.getElementById('primary-text');
      let text = '';
      switch (response.data.error.status) {
        case 401:
          text = 'You are not authorized to view this.';
          break;
        case 204:
          text = 'No song is playing.';
          break;
        default:
          text = 'Something went wrong.';
      }
      primaryTextElement.setAttribute('text', `value: ${text}`);
      return false;
    }

    if (!response || !response.data || response.data.error) {
      const primaryTextElement = document.getElementById('primary-text');
      primaryTextElement.setAttribute('text', 'value: No song found');
      return false;
    }

    const item = response.data.item;
    const imageUrls = item.album.images.map(image => image.url);
    const imageTitle = `${item.name} by ${item.artists[0].name} -- ${item.album.name}`;

    const primaryImageElement = document.getElementById('primary-image');
    primaryImageElement.setAttribute('rotation', {x: 0, y: 0, z: 0});
    if (imageUrls.length > 0) {
      primaryImageElement.setAttribute('src', imageUrls[0]);
    }

    const primaryTextElement = document.getElementById('primary-text');
    if (imageTitle) {
      primaryTextElement.setAttribute('text', `value: ${imageTitle}`);
    }

    // 3/4: Disable clicking on Spotify URL for now
    // if (item.external_urls.spotify && primaryImageElement) {
    //   primaryImageElement.addEventListener('mousedown', () => {
    //     pressTimeout = setTimeout(() => {
    //       window.location.href = item.external_urls.spotify;
    //     }, 2000);
    //   });
    //   primaryImageElement.addEventListener('mouseup', () => {
    //     clearTimeout(pressTimeout);
    //   });
    // }
    return true;
  }

  async function fetchTopTracks() {
    let response = null;
    try {
      response = await axios.get(`${BASE_API_URL}/top/tracks`, {
        params: { user_id: 'user1' },
      });
    } catch(e) {
      console.warn(e);
    }

    if (!response || !response.data.items || !response.data.items.length) {
      return;
    }

    const imagesElement = document.getElementById('images');
    const items = response.data.items;
    const padding = .25;
    let x = 0;
    let opacity = 1;
    items.forEach(item => {
      const images = item.album.images;
      if (images.length) {
        const imageUrl = images[0].url;
        const imageNode = document.createElement("a-image");
        imageNode.setAttribute('src', imageUrl);
        imageNode.setAttribute('width', 1);
        imageNode.setAttribute('height', 1);
        imageNode.setAttribute('position', `${x} 0 .1`);
        imageNode.setAttribute('opacity', opacity);
        imagesElement.appendChild(imageNode);
        x += 1 + padding;
        opacity -= .4;
      }
    });

    // TODO: Set an item as "active". We want to show the active item's song imageTitle
    const primaryTextElement = document.getElementById('primary-text');
    const item = items[0];
    const imageTitle = `${item.name} by ${item.artists[0].name} -- ${item.album.name}`;
    primaryTextElement.setAttribute('text', `value: ${imageTitle}`);
  }

  async function fetchCurrentlyPlayingWithFallback() {
    if (!(await fetchCurrentlyPlaying())) {
      console.log('Nothing playing');
      // fetchTopTracks();
    }
  }

  function listenToMarker() {
    const marker = document.getElementById('marker');
    marker.addEventListener('markerFound', () => {
			fetchCurrentlyPlayingWithFallback();
      listenToSwipe();
		});
    marker.addEventListener('markerLost', () => {
      stopListeningToSwipe();
    });
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
    const touch = e.changedTouches[0];
    if (distance < -1 * SWIPE_DISTANCE_THRESHOLD) { // Swipe right is negative
      let response;
      try {
        response = await axios.get(`${BASE_API_URL}/next`);
        const primaryImageElement = document.getElementById('primary-image');
        primaryImageElement.setAttribute('animation', 'loop', true);
        primaryImageElement.emit('rotate');
        setTimeout(async () => {
          await fetchCurrentlyPlaying();
          primaryImageElement.setAttribute('rotation', {x: 0, y: 0, z: 0});
          primaryImageElement.setAttribute('animation', 'loop', false);
        }, 3000);
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

  function listenToSwipe() {
    const scene = document.getElementById('scene');
    scene.addEventListener('touchstart', handleTouchStart);
    scene.addEventListener('touchmove', handleTouchMove);
    scene.addEventListener('touchend', handleTouchEnd);
  }

  function stopListeningToSwipe() {
    const scene = document.getElementById('scene');
    scene.removeEventListener('touchstart', handleTouchStart);
    scene.removeEventListener('touchmove', handleTouchMove);
    scene.removeEventListener('touchend', handleTouchEnd);
  }

  useEffect(() => {
    fetchCurrentlyPlayingWithFallback();
    listenToMarker();
  });

  return (
    <div className="App">
      <h1>Cobyo AR</h1>
    </div>
  );
}

export default App;
