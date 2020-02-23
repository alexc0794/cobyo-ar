import React, {useEffect, useState} from 'react';
import axios from 'axios'
import './App.css';

const BASE_API_URL = 'https://24tc87kqlk.execute-api.us-east-1.amazonaws.com/dev';

function App() {
  const [coverArt, setCoverArt] = useState(null);

  async function callApi() {
    try {
      const response = await axios.get(`${BASE_API_URL}/currently-playing`);
      console.log(response);
      const images = response.data.item.album.images;
      if (images && images.length > 0) {
        const url = images[0].url;
        const item = document.getElementById('coverArt');
        if (item) {
          item.setAttribute('src', url);
        }
        setCoverArt(url);
        console.log(url);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    callApi();
  });

  return (
    <div className="App">
      <h1>Cobyo AR</h1>
      {coverArt && <img src={coverArt} />}
    </div>
  );
}

export default App;
