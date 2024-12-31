// src/Admin/services/availabilityService.ts
import apiClient from '../../Apis/apiConfig';

export interface PersonalTrainerDto {
  id: number;
  username: string;
  email: string;
}

export interface TrainerAvailabilityRequest {
  day: string;       // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
}

export const fetchAvailableTrainers = async (): Promise<PersonalTrainerDto[]> => {
  const response = await apiClient.get('/trainers/available');
  return response.data;
};

export const createTrainerAvailability = async (
  trainerId: number | string,
  requestBody: TrainerAvailabilityRequest
): Promise<string> => {
  const response = await apiClient.post(`/trainer-schedule/${trainerId}/availability`, requestBody);
  return response.data;
};
