import axios from 'axios';

let BASE_URL = 'noteflow.live';

if (import.meta.env.VITE_DEV === '1') {
  BASE_URL = `localhost`;
}

console.log('bundle with route:', BASE_URL);

const instance = axios.create({
  baseURL: `https://${BASE_URL}/api`,
  withCredentials: true,
});

export default instance;
export { BASE_URL };
