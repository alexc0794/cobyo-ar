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
      const coverArtTitle = document.getElementById('coverArtTitle');
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
      coverArtTitle.setAttribute('text', `value: ${text}`);
      return false;
    }

    if (!response || !response.data || response.data.error) {
      const coverArtTitle = document.getElementById('coverArtTitle');
      coverArtTitle.setAttribute('text', 'value: No song found');
      return false;
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

    if (item.external_urls.spotify && coverArt) {
      coverArt.addEventListener('mousedown', () => {
        pressTimeout = setTimeout(() => {
          window.location.href = item.external_urls.spotify;
        }, 2000);
      });
      coverArt.addEventListener('mouseup', () => {
        clearTimeout(pressTimeout);
      });
    }

    return true;
  }

  async function fetchTopTracks() {
    let response = null;
    try {
      response = await axios.get(`${BASE_API_URL}/top/tracks`, {
        params: {
          user_id: 'user1'
        },
      });
    } catch(e) {
      console.warn(e);
    }

    if (!response || !response.data.items || !response.data.items.length) {
      return;
    }

    const curvedImageWrapper = document.getElementById('curvedImageWrapper');
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
        curvedImageWrapper.appendChild(imageNode);
        x += 1 + padding;
        opacity -= .4;
      }
    });

    // TODO: Set an item as "active". We want to show the active item's song imageTitle
    const coverArtTitle = document.getElementById('coverArtTitle');
    const item = items[0];
    const imageTitle = `${item.name} by ${item.artists[0].name} -- ${item.album.name}`;
    coverArtTitle.setAttribute('text', `value: ${imageTitle}`);
  }

  async function fetchCurrentlyPlayingWithFallback() {
    if (!(await fetchCurrentlyPlaying())) {
      fetchTopTracks();
    }
  }

  function listenToMarker() {
    const marker = document.getElementById('marker');
    console.log(marker);
    marker.addEventListener('markerFound', function() {
			fetchCurrentlyPlayingWithFallback();
		});
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
