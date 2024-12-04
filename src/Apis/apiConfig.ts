// src/api/apiClient.ts

import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Usa la variable de entorno
});

// Interceptor para agregar el token de autenticación en cada solicitud
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('[API Client] Error en la solicitud:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
