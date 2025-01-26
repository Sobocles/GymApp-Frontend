import apiClient from '../Apis/apiConfig';

export const getDiscountedProducts = async () => {
  try {
    // Ajusta la ruta según tu backend (aquí asumo '/store/products/offers')
    const response = await apiClient.get('/store/products/offers');
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos en oferta:', error);
    throw error;
  }
};
