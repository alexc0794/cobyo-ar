import axios from 'axios'
import { BASE_API_URL } from '../../config';


export function fetchRecentlyPlayedAnalysis() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/recently-played/analysis`
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
        console.log(response);
        return resolve(response);
      }
    } catch (e) {
      console.error(e);
      return reject('Something went wrong');
    }
  });
}
