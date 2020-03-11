import { useEffect } from 'react';
import { fetchTopTracks } from './services/topTracksService';
import { fetchRecentlyPlayed } from './services/recentlyPlayedService';


function Tracklist({
  recentlyPlayed
}) {
  const imagesElement = document.getElementById('images');
  const secondaryTextElement = document.getElementById('secondary-text');
  let interval;

  useEffect(() => {
    loadTracklist()
    return () => {
      clearInterval(interval);
      while (imagesElement.firstChild) {
        imagesElement.removeChild(imagesElement.lastChild);
      }
    };
  });

  async function fetchTracklist() {
    let tracks;
    try {
      if (recentlyPlayed) {
        throw new Error();
      }
      tracks = await fetchTopTracks();
    } catch (e) {
      try {
        tracks = await fetchRecentlyPlayed();
      } catch (e) {
        return {
          imageUrls: [],
          trackNames: [],
          artistNames: [],
        };
      }
    }
    return {
      imageUrls: tracks.map(track => track.album.images[0].url),
      trackNames: tracks.map(track => track.name),
      artistNames: tracks.map(track => track.artists[0].name),
    };
  }

  async function loadTracklist() {
    const POSITION_Z = .2

    const { imageUrls, trackNames, artistNames } = await fetchTracklist();
    if (!imageUrls.length) {
      return;
    }
    const padding = .1;
    // TODO: Currently assuming 3x3 grid
    let x = -.5 - padding;
    let y = .5 + padding;
    imageUrls.forEach((imageUrl, i) => {
      const imageNode = document.createElement('a-image');
      imageNode.setAttribute('id', `a-image-${trackNames[i]}`)
      imageNode.setAttribute('src', imageUrl);
      imageNode.setAttribute('width', .5);
      imageNode.setAttribute('height', .5);
      imageNode.setAttribute('position', `${x} ${y} ${POSITION_Z}`);
      imagesElement.appendChild(imageNode);
      x += .5 + padding;
      if ((i+1) % 3 === 0) {
        y -= (.5 + padding);
        x = -.5 - padding; // Reset x, should be same as initial value
      }
    });

    secondaryTextElement.setAttribute('position', '0 -1 0');
    let i = 0;
    interval = setInterval(() => {
      secondaryTextElement.setAttribute('text', `value: ${i + 1}. ${trackNames[i]} by ${artistNames[i]}`);
      const selectedImage = document.getElementById(`a-image-${trackNames[i]}`);
      selectedImage.setAttribute('position', {
        ...selectedImage.getAttribute('position'),
        z: .75
      });
      selectedImage.setAttribute('scale', '1.5 1.5 1.5');
      selectedImage.setAttribute('light', 'type: point; intensity: 2.0');
      const previousIndex = i === 0 ? imageUrls.length - 1 : i - 1;
      const previousImage = document.getElementById(`a-image-${trackNames[previousIndex]}`);
      previousImage.setAttribute('position', {
        ...previousImage.getAttribute('position'),
        z: POSITION_Z,
      });
      previousImage.setAttribute('scale', '1 1 1');
      i++;
      i %= imageUrls.length;
    }, 2500);
  }

  return null;
}

export default Tracklist;
