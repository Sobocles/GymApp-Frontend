
import apiClient from '../Apis/apiConfig';


export const getCarouselImages = async () => {
  try {
    const response = await apiClient.get('/carousel/images');
    return response.data;
  } catch (error) {
    console.error('Error al obtener las imágenes del carrusel:', error);
    throw error;
  }
};



