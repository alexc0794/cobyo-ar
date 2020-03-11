import axios from 'axios'
import { BASE_API_URL } from '../../config';


export function fetchTopTracks() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/top/tracks`);
      if (response.data.error) {
        switch (response.data.error.status) {
          case 401:
            return reject('You are not authorized to view this.');
          case 204:
            return reject('No songs were found.');
          default:
            return reject('Something went wrong.');
        }
      } else {
        const tracks = response.data.items;
        return resolve(tracks);
      }
    } catch (e) {
      console.error(e);
      return reject('Something went wrong');
    }
  });
}
