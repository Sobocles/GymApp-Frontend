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
    console.log("AAAAAAAAAA",userData);
    const response = await axios.post('http://localhost:8080/users/register', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("AQUI LA RESPUESTA DEL REGISTER", response);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Función para manejar errores
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error(`Error ${error.response.status}: ${error.response.data.message || 'Error en el servidor'}`);
      throw new Error(
        `Error ${error.response.status}: ${
          error.response.data.message || 'Error en el servidor'
        }`
      );
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor. Verifica tu conexión.');
      throw new Error('No se recibió respuesta del servidor. Verifica tu conexión.');
    }
  }
  console.error('Ocurrió un error desconocido.');
  throw new Error('Ocurrió un error desconocido.');
};
