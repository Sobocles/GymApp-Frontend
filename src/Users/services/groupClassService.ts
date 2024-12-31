// src/api/groupClassService.ts

import apiClient from '../../Apis/apiConfig';

export interface GroupClass {
  id: number;
  className: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  maxParticipants: number;
  assignedTrainer?: {
    id: number;
    user: {
      username: string;
      email: string;
    };
    specialization?: string;
  };
}

export const getAvailableGroupClasses = async (): Promise<GroupClass[]> => {
  const response = await apiClient.get('/group-classes/available');
  return response.data;
};

export const bookGroupClass = async (classId: number) => {
  const response = await apiClient.post(`/group-classes/${classId}/book`);
  return response.data;
};

// Ya teníamos createGroupClass y assignTrainerToClass, las dejamos como están.
