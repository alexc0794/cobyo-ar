import React, {useEffect, useState} from 'react';
import axios from 'axios'
import MockData from './MockData';
import './App.css';

// const BASE_API_URL = 'http://localhost:8080'
const BASE_API_URL = 'https://24tc87kqlk.execute-api.us-east-1.amazonaws.com/dev';

function App() {

  let pressTimeout = null;

  async function fetchCurrentlyPlaying() {
    const response = await axios.get(`${BASE_API_URL}/currently-playing`, {
      user_id: 'user1'
    });
    if (response && response.data && response.data.error && response.data.error.status == 401) {
      const coverArtTitle = document.getElementById('coverArtTitle');
      coverArtTitle.setAttribute('text', 'value: Token expired');
      return;
    }

    if (!response || !response.data || response.data.error) {
      const coverArtTitle = document.getElementById('coverArtTitle');
      coverArtTitle.setAttribute('text', 'value: No song found');
      return;
    }

    const item = response.data.item;
    const imageUrls = item.album.images.map(image => image.url);
    const imageTitle = `${item.name} by ${item.artists[0].name} -- ${item.album.name}`;

    const coverArt = document.getElementById('coverArt');
    if (coverArt && imageUrls.length > 0) {
      coverArt.setAttribute('src', imageUrls[0]);
    }

    const coverArtTitle = document.getElementById('coverArtTitle');
    if (coverArtTitle && imageTitle) {
      coverArtTitle.setAttribute('text', `value: ${imageTitle}`);
    }

    if (item.external_urls.spotify) {
      const marker = document.getElementById('marker');
      marker.addEventListener('mousedown', () => {
        pressTimeout = setTimeout(() => {
          window.location.href = item.external_urls.spotify;
        }, 2000);
      });
      marker.addEventListener('mouseup', () => {
        clearTimeout(pressTimeout);
      });
    }
  }

  useEffect(() => {
    fetchCurrentlyPlaying();
  });

  return (
    <div className="App">
      <h1>Cobyo AR</h1>
    </div>
  );
}

export default App;
