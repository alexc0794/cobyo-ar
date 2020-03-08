import { fetchTopTracks } from './services/topTracksService';

async function fetchPlaylist() {
  let tracks;
  try {
    tracks = await fetchTopTracks();
  } catch (e) {
    return {
      imageUrls: [],
    };
  }
  return {
    imageUrls: tracks.map(track => track.album.images[0].url)
  };
}

export async function loadPlaylist() {
  const imagesElement = document.getElementById('images');
  const { imageUrls } = await fetchPlaylist();
  const padding = .25;
  let x = 0;
  let opacity = 1;
  imageUrls.forEach(imageUrl => {
    const imageNode = document.createElement('a-image');
    imageNode.setAttribute('src', imageUrl);
    imageNode.setAttribute('width', 1);
    imageNode.setAttribute('height', 1);
    imageNode.setAttribute('position', `${x} 0 .1`);
    imageNode.setAttribute('opacity', opacity);
    imagesElement.appendChild(imageNode);
    x += 1 + padding;
    opacity -= .4;
  });
}
