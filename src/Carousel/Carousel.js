import { useEffect } from 'react';
import { fetchTopTracks } from './services/topTracksService';

const defaultProps = {
  radius: 1.75,
  swipeDistanceThreshold: window.innerWidth - 100, // pixels
};

function Carousel({
  radius,
  swipeDistanceThreshold
}) {
  const carouselElement = document.getElementById('carousel');

  useEffect(() => {
    loadTracklist();

    return () => {
      while (carouselElement.firstChild) {
        carouselElement.removeChild(carouselElement.lastChild);
      }
    };
  });

  async function loadTracklist() {
    const tracks = await fetchTopTracks();
    const numItems = tracks.length;

    const delta = 2 * Math.PI / numItems;
    let radian = 0;
    let x = 0;
    let z = radius;

    tracks.forEach(track => {
      const carouselItemElement = document.createElement('a-image');
      carouselItemElement.setAttribute('id', `carousel-item-${track.name}`);
      carouselItemElement.setAttribute('src', track.album.images[0].url);
      carouselItemElement.setAttribute('width', 1);
      carouselItemElement.setAttribute('height', 1);
      carouselItemElement.setAttribute('side', 'front');
      x = _calculateX(radius, radian);
      z = _calculateZ(radius, radian);
      carouselItemElement.setAttribute('position', { x, y: 0, z });
      carouselItemElement.setAttribute('radian', radian);
      carouselItemElement.setAttribute('opacity', _calculateOpacity(radius, z));

      // Find next position the item would go to for animation purposes
      const nextX = _calculateX(radius, radian + delta);
      const nextZ = _calculateZ(radius, radian + delta);

      carouselItemElement.setAttribute('animation__position', {
        property: 'position',
        to: {x: nextX, y: 0, z: nextZ},
        dur: 2000,
        startEvents: ['swiped']
      });
      carouselItemElement.setAttribute('animation__opacity', {
        property: 'opacity',
        to: _calculateOpacity(radius, nextZ),
        dur: 2000,
        startEvents: ['swiped']
      });
      carouselElement.appendChild(carouselItemElement);
      radian += delta;
    });

    setInterval(() => {
      loadTouchListeners();
    }, 2000);
  }

  function _calculateX(radius, radian) {
    return Math.round(Math.sin(radian) * radius);
  }

  function _calculateZ(radius, radian) {
    return Math.round(Math.cos(radian) * radius);
  }

  function _calculateOpacity(radius, z) {
    return (radius + z) / (2 * radius);
  }

  function loadTouchListeners() {
    const scene = document.getElementById('scene');
    scene.addEventListener('touchstart', handleTouchStart);
    scene.addEventListener('touchmove', handleTouchMove);
    scene.addEventListener('touchend', handleTouchEnd);
  }

  let startX = 0;
  let distance = 0;

  function handleTouchStart(e) {
    const touch = e.changedTouches[0];
    startX = parseInt(touch.clientX);
    e.preventDefault();
  }

  function handleTouchMove(e) {
    const touch = e.changedTouches[0];
    distance = parseInt(touch.clientX) - startX;
    e.preventDefault();
  }

  function handleTouchEnd(e) {
    if (distance < -1 * swipeDistanceThreshold) { // Swipe right is negative
      const carouselItemElements = Array.from(carouselElement.children);
      carouselItemElements.forEach(carouselItemElement => {
        carouselItemElement.emit('swiped');
      });
    }

    startX = 0;
    distance = 0;
    e.preventDefault();
  }

  return null;
}

Carousel.defaultProps = defaultProps;

export default Carousel;
