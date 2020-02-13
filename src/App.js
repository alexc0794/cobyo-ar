import React, {Component} from 'react';
import axios from 'axios'
import logo from './logo.svg';
import './App.css';

class App extends Component {

  componentDidMount() {
    axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': 'Bearer BQDeJxjscGmUFm_g44LWdTqV6V_M8J1QinO1xwDyBUDOMyMsTQsKZPPGqpESigvupYMD57AL51HUMmukewmLlSvNGSKkSFQ8lz81UhFwUErSh4kg36_SBHN7udFm_oFgraWapHJf1y9Iu7bFV1IT',
      }
    }).then(response => {
      const images = response.data.item.album.images;
      if (images && images.length > 0) {
        const url = images[0].url;
        const item = document.getElementById('coverArt');
        item.setAttribute('src', url)
      }
    })
  }

  render() {
    return (
      <div className="App"></div>
    )
  }
}

export default App;
