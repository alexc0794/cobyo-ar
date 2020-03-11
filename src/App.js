import React, { useState } from 'react';
import Track from './Track/Track';
import Tracklist from './Tracklist/Tracklist';
import Button from 'react-bootstrap/Button';
import './App.css';


function App() {
  const [markerType, setMarkerType] = useState('TRACK');

  function handleClickTopSongsButton() {
    const images = document.getElementById('images');
    const primaryImage = document.getElementById('primary-image');
    const primaryText = document.getElementById('primary-text');
    const secondaryText = document.getElementById('secondary-text');

    if (markerType === 'TRACKLIST') {
      images.setAttribute('visible', false);
      secondaryText.setAttribute('visible', false);

      primaryImage.setAttribute('visible', true);
      primaryText.setAttribute('visible', true)

      setMarkerType('TRACK');
    } else {
      primaryImage.setAttribute('visible', false);
      primaryText.setAttribute('visible', false);

      images.setAttribute('visible', true);
      secondaryText.setAttribute('visible', true);

      setMarkerType('TRACKLIST');
    }
  }

  return (
    <div className="App">
      <div className="buttons">
        <Button onClick={handleClickTopSongsButton}>
          {markerType === 'TRACKLIST' ? 'See Currently Listening' : 'See Top Songs'}
        </Button>
        {markerType === 'TRACK' && (
          <Track />
        )}
        {markerType === 'TRACKLIST' && (
          <Tracklist />
        )}
      </div>
    </div>
  );
}

export default App;
