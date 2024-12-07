// src/services/authService.ts

import axios from 'axios';
import apiClient from '../../Apis/apiConfig';
import { LoginCredentials } from '../Interfaces/AuthInterface';


export const loginUser = async ({ email, password }: LoginCredentials) => {
  try {
    const response = await apiClient.post('/login', { email, password });
    console.log("ACA RESPONSE",response);
    console.log("ACA DATA",response.data);
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post('/register', userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Función para manejar errores de la API
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      throw new Error(
        `Error ${error.response.status}: ${
          error.response.data.message || 'Error en el servidor'
        }`
      );
    } else if (error.request) {
      throw new Error(
        'No se recibió respuesta del servidor. Verifica tu conexión.'
      );
    }
  }
  throw new Error('Ocurrió un error desconocido.');
};
