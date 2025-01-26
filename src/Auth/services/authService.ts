// src/services/authService.ts

import axios from 'axios';
import apiClient from '../../Apis/apiConfig';
import { LoginCredentials } from '../Interfaces/AuthInterface';


export const loginUser = async ({ email, password }: LoginCredentials) => {
  try {
    console.log(
      "entro");
    const response = await apiClient.post('/login', { email, password });

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

    const response = await axios.post('http://localhost:8080/users/register', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Función para manejar errores
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    // Retiras el throw de new Error y simplemente relanzas el error original
    throw error; 
  }
  // Si no es un AxiosError, aquí lanzas algo genérico
  throw new Error('Ocurrió un error desconocido.');
};

