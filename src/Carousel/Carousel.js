import { useEffect, useState } from 'react';
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

  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (tracks.length) {
      displayCarousel();
      loadTouchListeners();
    } else {
      loadTracklist();
    }

    return () => {
      while (carouselElement.firstChild) {
        carouselElement.removeChild(carouselElement.lastChild);
      }
      removeTouchListeners();
    };
  });

  async function loadTracklist() {
    const tracks = await fetchTopTracks();
    if (tracks.length) {
      setTracks(tracks);
    }
  }

  function getCarouselItemId(track) {
    return `carousel-item-${track.id}`;
  }

  function getRadianDelta() {
    return 2 * Math.PI / tracks.length;
  }

  function displayCarousel() {
    const delta = getRadianDelta();
    let x = 0;
    let z = radius;

    tracks.forEach((track, i) => {
      const radian = i * delta;
      let carouselItemElement = document.getElementById(getCarouselItemId(track));
      if (!carouselItemElement) {
        carouselItemElement = document.createElement('a-image');
        carouselItemElement.setAttribute('id', getCarouselItemId(track));
        carouselItemElement.setAttribute('src', track.album.images[0].url);
        carouselItemElement.setAttribute('width', 1);
        carouselItemElement.setAttribute('height', 1);
      }
      x = _calculateX(radius, radian);
      z = _calculateZ(radius, radian);
      carouselItemElement.setAttribute('position', { x, y: 0, z });
      carouselItemElement.setAttribute('radian', radian);
      carouselItemElement.setAttribute('opacity', _calculateOpacity(radius, z));
      setAnimation(carouselItemElement, i);

      carouselElement.appendChild(carouselItemElement);
    });
  }

  function setAnimation(carouselItemElement, i) {
    const delta = getRadianDelta();
    const radian = i * delta;
    // Find next position the item would go to for animation purposes
    const nextX = _calculateX(radius, radian + delta);
    const nextZ = _calculateZ(radius, radian + delta);
    carouselItemElement.setAttribute('animation__position', {
      property: 'position',
      to: {x: nextX, y: 0, z: nextZ},
      dur: 1000,
      startEvents: ['swiped']
    });
    carouselItemElement.setAttribute('animation__opacity', {
      property: 'opacity',
      to: _calculateOpacity(radius, nextZ),
      dur: 1000,
      startEvents: ['swiped']
    });
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
    // TODO: REMOVE
    setTimeout(() => {
      handleTouchStart();
    }, 1000);

    const scene = document.getElementById('scene');
    scene.addEventListener('touchstart', handleTouchStart);
  }

  function removeTouchListeners() {
    const scene = document.getElementById('scene');
    scene.removeEventListener('touchstart', handleTouchStart);
  }

  function handleTouchStart(e) {
    // const touch = e.changedTouches[0];
    console.log(window.innerWidth);
    const touchX = 800// parseInt(touch.clientX);
    const padding = 50;
    const swipedRight = touchX < window.innerWidth / 2 - padding;
    const swipedLeft = touchX > window.innerWidth / 2 + padding;
    if (!swipedRight && !swipedLeft) {
      return;
    }

    tracks.forEach((track, i) => {
      const carouselItemElement = document.getElementById(getCarouselItemId(track));
      carouselItemElement.emit('swiped');
    });

    setTimeout(() => {
      if (swipedLeft) {
        setTracks([
          ...tracks.slice(-1),
          ...tracks.slice(0, -1),
        ]);
      }
      if (swipedRight) {
        setTracks([
          ...tracks.slice(1),
          tracks[0],
        ]);
      }
    }, 1000);
    // e.preventDefault();
  }

  return null;
}

Carousel.defaultProps = defaultProps;

export default Carousel;
