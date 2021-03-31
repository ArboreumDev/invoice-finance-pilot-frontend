import axios from 'axios';

const axiosInstance = () => {
  const defaultOptions = {
    baseURL: "http://localhost:8000/",
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