import axios from 'axios';

let BASE_URL = import.meta.env.VITE_NOTEFLOW_BACKEND;

if (import.meta.env.VITE_DEV === '1') {
  BASE_URL = `localhost`;
}

const instance = axios.create({
  baseURL: `https://${BASE_URL}/api`,
  withCredentials: true,
});

export default instance;
export { BASE_URL };
