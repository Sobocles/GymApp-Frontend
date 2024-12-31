// src/Store/hooks/useProducts.ts
import { useState } from 'react';
import { Product } from '../interface/Product';
import { getProductsPage } from '../services/ProductService';

interface Paginator {
  number: number;     // página actual
  totalPages: number;
  first: boolean;
  last: boolean;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [paginator, setPaginator] = useState<Paginator>({
    number: 0,
    totalPages: 0,
    first: true,
    last: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Podrías también manejar searchTerm, category, etc. en este hook
  const fetchProducts = async (page: number, category?: string) => {
    setIsLoading(true);
    try {
      const productPage = await getProductsPage(page, 12, category);
      setProducts(productPage.content);
      setPaginator({
        number: productPage.number,
        totalPages: productPage.totalPages,
        first: productPage.first,
        last: productPage.last,
      });
    } catch (error) {
      console.error('Error al cargar productos paginados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products,
    paginator,
    isLoading,
    fetchProducts,
  };
};
