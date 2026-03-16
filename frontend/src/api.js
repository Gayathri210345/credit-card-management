import axios from 'axios';

const api = axios.create({ 
  baseURL: 'https://ccams-backend.onrender.com/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('ccams_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;