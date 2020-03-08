import axios from 'axios'
import { BASE_API_URL } from '../../config';


export function fetchRecentlyPlayed() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/recently-played`);
      if (response.data.error) {
        switch (response.data.error.status) {
          case 401:
            return reject('You are not authorized to view this.');
          case 204:
            return reject('No songs were played.');
          default:
            return reject('Something went wrong.');
        }
      } else {
        const track = response.data.items[0].track;
        return resolve(track);
      }
    } catch (e) {
      console.error(e);
      return reject('Something went wrong');
    }
  });
}
