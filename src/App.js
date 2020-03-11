import React, { useState } from 'react';
import Track from './Track/Track';
import Tracklist from './Tracklist/Tracklist';
import Analysis from './Analysis/Analysis';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import './App.css';


function App() {
  const [markerType, setMarkerType] = useState('CURRENTLY_PLAYING');

  const images = document.getElementById('images');
  const primaryImage = document.getElementById('primary-image');
  const primaryText = document.getElementById('primary-text');
  const secondaryText = document.getElementById('secondary-text');

  function handleClickCurrentlyPlaying() {
    images.setAttribute('visible', false);
    secondaryText.setAttribute('visible', false);
    primaryImage.setAttribute('visible', true);
    primaryText.setAttribute('visible', true)

    setMarkerType('CURRENTLY_PLAYING');
  }

  function handleClickRecentlyPlayedButton() {
    primaryImage.setAttribute('visible', false);
    primaryText.setAttribute('visible', false);

    images.setAttribute('visible', true);
    secondaryText.setAttribute('visible', true);

    setMarkerType('RECENTLY_PLAYED');
  }

  function handleClickCurrentFavorites() {
    primaryImage.setAttribute('visible', false);
    primaryText.setAttribute('visible', false);

    images.setAttribute('visible', true);
    secondaryText.setAttribute('visible', true);

    setMarkerType('CURRENT_FAVORITES');
  }

  return (
    <div className="App">
      <div className="buttons">
        <ButtonGroup>
          <Button onClick={handleClickCurrentlyPlaying}>
            Currently Playing
          </Button>
          <Button onClick={handleClickRecentlyPlayedButton}>
            Recently Played
          </Button>
          <Button onClick={handleClickCurrentFavorites}>
            Current Favorites
          </Button>

        </ButtonGroup>
        {markerType === 'CURRENTLY_PLAYING' && (
          <Track />
        )}
        {markerType === 'CURRENT_FAVORITES' && (
          <Tracklist />
        )}
        {markerType === 'RECENTLY_PLAYED' && (
          <Tracklist recentlyPlayed />
        )}
        {markerType === 'ANALYSIS' && (
          <Analysis />
        )}
      </div>
    </div>
  );
}

export default App;
