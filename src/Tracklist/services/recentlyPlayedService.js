import axios from 'axios'
import { BASE_API_URL, USE_MOCK_DATA } from '../../config';
import recentlyPlayedMock from './mock/recentlyPlayedMock';


export function fetchRecentlyPlayed() {
  return new Promise(async (resolve, reject) => {
    try {
      const limit = 9;
      const response = USE_MOCK_DATA ? recentlyPlayedMock : await axios.get(
        `${BASE_API_URL}/recently-played?limit=${limit}`
      );
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
        const tracks = response.data.items.map(item => item.track);
        return resolve(tracks);
      }
    } catch (e) {
      console.error(e);
      return reject('Something went wrong');
    }
  });
}
