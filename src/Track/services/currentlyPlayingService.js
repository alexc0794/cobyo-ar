import axios from 'axios'
import { BASE_API_URL, USE_MOCK_DATA } from '../../config';
import currentlyPlayingMock from './mock/currentlyPlayingMock';


export function fetchCurrentlyPlaying() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = USE_MOCK_DATA ? currentlyPlayingMock : await axios.get(
        `${BASE_API_URL}/currently-playing`
      );
      if (response.data.error) {
        switch (response.data.error.status) {
          case 401:
            return reject('You are not authorized to view this.');
          case 204:
            return reject('No song is playing.');
          default:
            return reject('Something went wrong.');
        }
      } else {
        const track = response.data.item;
        return resolve(track)
      }
    } catch (e) {
      console.log(e.message);
      return reject('Something went wrong');
    }
  });
}
