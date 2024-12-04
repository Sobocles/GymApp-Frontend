// src/Trainers/services/TrainerService.ts

import { UserInterface } from '../../Auth/Interfaces/UserInterface';
import apiClient from '../../Apis/apiConfig';

export const updateTrainerProfile = async (formData: FormData): Promise<UserInterface> => {
  console.log("AQUI ESTA LA DATA", formData);
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

  return response.data; // Retorna solo los datos del usuario
};
