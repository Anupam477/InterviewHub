import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.PROD 
    ? '/api' 
    : 'http://localhost:5000/api',
});

// Automatically add token to headers if present in localStorage
API.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
