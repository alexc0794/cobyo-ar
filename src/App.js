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
    setMarkerType('CURRENTLY_PLAYING');
    images.setAttribute('visible', false);
    secondaryText.setAttribute('visible', false);
    primaryImage.setAttribute('visible', true);
    primaryText.setAttribute('visible', true)
  }

  function handleClickRecentlyPlayedButton() {
    setMarkerType('RECENTLY_PLAYED');
    primaryImage.setAttribute('visible', false);
    primaryText.setAttribute('visible', false);
    images.setAttribute('visible', true);
    secondaryText.setAttribute('visible', true);
  }

  function handleClickCurrentFavorites() {
    setMarkerType('CURRENT_FAVORITES');
    primaryImage.setAttribute('visible', false);
    primaryText.setAttribute('visible', false);
    images.setAttribute('visible', true);
    secondaryText.setAttribute('visible', true);
  }

  return (
    <div className="App">
      <div className="buttons">
        <ButtonGroup>
          <Button
            variant={markerType==='CURRENTLY_PLAYING' ? "outline-primary" : "primary"}
            onClick={handleClickCurrentlyPlaying}
          >
            Live
          </Button>
          <Button
            variant={markerType==='RECENTLY_PLAYED' ? "outline-primary" : "primary"}
            onClick={handleClickRecentlyPlayedButton}
          >
            Recents
          </Button>
          <Button
            variant={markerType==='CURRENT_FAVORITES' ? "outline-primary" : "primary"}
            onClick={handleClickCurrentFavorites}
          >
            Favorites
          </Button>

        </ButtonGroup>
        {markerType === 'CURRENTLY_PLAYING' && (
          <Track />
        )}
        {markerType === 'RECENTLY_PLAYED' && (
          <Tracklist recentlyPlayed />
        )}
        {markerType === 'CURRENT_FAVORITES' && (
          <Tracklist />
        )}
        {markerType === 'ANALYSIS' && (
          <Analysis />
        )}
      </div>
    </div>
  );
}

export default App;
