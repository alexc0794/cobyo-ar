import axios from 'axios'
import { BASE_API_URL, USE_MOCK_DATA } from '../../config';
import recentlyPlayedMock from './mock/recentlyPlayedMock';


export function fetchRecentlyPlayed() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = USE_MOCK_DATA ? recentlyPlayedMock : await axios.get(
        `${BASE_API_URL}/recently-played`
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
        const track = response.data.items[0].track;
        return resolve(track);
      }
    } catch (e) {
      console.error(e);
      return reject('Something went wrong');
    }
  });
}
