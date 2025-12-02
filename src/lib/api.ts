import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  // auth, recuperar token localStorage:
  // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;