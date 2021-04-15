import axios from 'axios';

console.log('from env', process.env.BACKEND_URL)
// TODO why is this not working?
const baseUrl = process.env.BACKEND_URL || "http://localhost:8000/"

const axiosInstance = () => {
  const defaultOptions = {
    baseURL: baseUrl,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Create instance
  let instance = axios.create(defaultOptions);

  // Set the AUTH token for any request
  instance.interceptors.request.use(function (config) {
    const tokenString = localStorage.getItem('arboreum:info');
    const token = tokenString ? JSON.parse(tokenString).token : ''
    config.headers.Authorization =  `Bearer ${token}`;
    return config;
  });

  return instance;
};

export default axiosInstance();


export const fetcher = (url) => axiosInstance().get(url).then((res) => res.data);