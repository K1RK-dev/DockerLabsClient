import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';

const cookieJar = new CookieJar();

const baseURL = localStorage.getItem('apiURL') || 'http://localhost:5000'

const axiosInstance = wrapper(axios.create({
  baseURL: baseURL,
  withCredentials: true,
  jar: cookieJar
}));

setupCache(axiosInstance, { ttl: 1000 });

axiosInstance.interceptors.request.use(config => {
  return config;
});

axiosInstance.interceptors.response.use(response => {
  return response;
});

export default axiosInstance;