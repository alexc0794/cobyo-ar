import { useEffect } from 'react';
import { fetchTopTracks } from './services/topTracksService';


function Carousel() {
  const carouselElement = document.getElementById('carousel');

  useEffect(() => {
    loadTracklist();
  });

  async function loadTracklist() {
    const tracks = await fetchTopTracks();
    const numItems = tracks.length;

    const delta = 2 * Math.PI / numItems;
    let radian = 0;
    const RADIUS = 1.75;
    let x = 0;
    let z = RADIUS;

    tracks.forEach(track => {
      const carouselItemElement = document.createElement('a-image');
      carouselItemElement.setAttribute('id', `carousel-item-${track.name}`);
      carouselItemElement.setAttribute('src', track.album.images[0].url);
      carouselItemElement.setAttribute('width', 1);
      carouselItemElement.setAttribute('height', 1);
      carouselItemElement.setAttribute('side', 'front');
      x = Math.sin(radian) * RADIUS;
      z = Math.cos(radian) * RADIUS;
      carouselItemElement.setAttribute('position', { x, y: 0, z });
      carouselItemElement.setAttribute('opacity', (RADIUS + z) / (2*RADIUS));
      carouselElement.appendChild(carouselItemElement);
      radian += delta;
    });
  }

  return null;
}

export default Carousel;
