// src/Trainers/services/TrainerService.ts

import { UserInterface } from '../../Auth/Interfaces/UserInterface';
import apiClient from '../../Apis/apiConfig';

// src/Trainers/services/TrainerService.ts

export const updateTrainerProfile = async (formData: FormData): Promise<UserInterface> => {
  console.log("AQUI ESTA LA DATA (Formulario):", {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    file: formData.get('file'),
  });
  
  const token = sessionStorage.getItem('token');
  
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await apiClient.put<UserInterface>('/profile/update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("Respuesta del servidor:", response.data);
  return response.data; // Retorna solo los datos del usuario
};



export const getClients = async () => {
  try {
    const response = await apiClient.get('/trainers/clients');
    console.log("AQUI LOS USUARIOS",response);
    return response.data;
  } catch (error) {
    console.error('[TrainerClientService] Error fetching clients:', error);
    throw error;
  }
};

