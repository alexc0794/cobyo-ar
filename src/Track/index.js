import { fetchCurrentlyPlaying } from './services/currentlyPlayingService';
import { fetchRecentlyPlayed } from './services/recentlyPlayedService';

async function fetchTrack() {
  let track;
  try {
    track = await fetchCurrentlyPlaying();
  } catch {
    try {
      track = await fetchRecentlyPlayed();
    } catch {
      return null;
    }
  }
  return {
    imageUrl: track.album.images[0].url,
    imageTitle: `${track.name} by ${track.artists[0].name}`,
    trackUrl: track.external_urls.spotify,
  };
}

let pressTimeout;

export async function loadTrack() {
  const primaryImageElement = document.getElementById('primary-image');
  const primaryTextElement = document.getElementById('primary-text');
  const { imageTitle, imageUrl, trackUrl } = await fetchTrack();
  if (imageUrl) {
    primaryImageElement.setAttribute('src', imageUrl);
  }
  if (imageTitle) {
    primaryTextElement.setAttribute('text', `value: ${imageTitle}`);
  }
  if (trackUrl) {
    primaryImageElement.addEventListener('mousedown', () => {
      pressTimeout = setTimeout(() => window.location.href = trackUrl, 2000);
    });
    primaryImageElement.addEventListener('mouseup', () => clearTimeout(pressTimeout));
  }
}
