    // src/Store/services/ProductService.ts
    import apiClient from '../../Apis/apiConfig';
import { Product } from '../interface/Product';
import { CartItem } from '../Store/slices/cartSlice';


interface ProductPage {
  content: Product[];
  number: number;      // página actual
  totalPages: number;  // total de páginas
  first: boolean;
  last: boolean;
  // ... otros campos que Page<Product> devuelva
}
  
  export const getAllProducts = async (): Promise<Product[]> => {
      console.log("AQUI LLEGA");
    const response = await apiClient.get('/store/products');
    console.log("AQUI LA RESPONSE",response);
    return response.data;
  };

 
  export const getProductsByCategory = async (categoryName: string): Promise<Product[]> => {
    const response = await apiClient.get('/store/products', {
      params: {
        category: categoryName,
      },
    });
    return response.data;
  };


  export const getProductById = async (id: number) => {
    console.log("AQUI ESTA EL ID DEL PRODUCTO",id);
    const response = await apiClient.get(`/store/products/${id}`);
    console.log("AQUI LA RESPONSE",response);
    return response.data;
  };

  export const getProductsPage = async (
    page: number,
    size: number,
    category?: string,
    sortBy?: string
  ): Promise<ProductPage> => {
    // Parametrizamos la llamada
    const params: any = {};
    if (category) params.category = category;
    if (sortBy) params.sortBy = sortBy;
    params.size = size;
  
    const response = await apiClient.get(`/store/products/page/${page}`, { params });
    return response.data;  
  };
  

  // ProductService.ts (frontend)
export const getProductsBySearch = async (term: string): Promise<Product[]> => {
  const response = await apiClient.get('/store/products/search', {
    params: { term },
  });
  return response.data; // un array de Product
};

export const createProductPreference = async (items: CartItem[]) => {
 
    // Enviar solicitud POST con los items del carrito
    const response = await apiClient.post('/payment/create_product_preference', items);

    console.log('Preferencia de pago creada:', response.data);
    return response.data;  // Retorna el punto de inicio del checkout (initPoint)
    

};





