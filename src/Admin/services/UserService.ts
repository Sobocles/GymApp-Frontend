import apiClient  from "../../Apis/apiConfig";
import { UserInterface } from '../../Auth/Interfaces/UserInterface';


const BASE_URL = '';

export const findAll = async() => {
  try {
 
      const response = await apiClient.get(BASE_URL);

      return response;
  } catch (error) {
      console.error("[UserService] Error en findAll:", error);
      throw error;
  }
}

export const findAllPages = async (page = 0, search = '') => {
  try {
 
    const response = await apiClient.get(`${BASE_URL}/page/${page}`, {
      params: {
        search,
      },
    });

    return response;
  } catch (error) {
    console.error("[UserService] Error en findAllPages:", error);
    throw error;
  }
};
  

export const save = async ({ username, email, password, admin, trainer }: UserInterface) => {
    return await apiClient.post(BASE_URL, { username, email, password, admin, trainer });
  };
  
  export const update = async ({ id, username, email, admin, trainer }: UserInterface) => {
    return await apiClient.put(`${BASE_URL}/${id}`, { username, email, admin, trainer });
  };
  


export const remove = async (id: string) => {
    await apiClient.delete(`${BASE_URL}/${id}`);
};
