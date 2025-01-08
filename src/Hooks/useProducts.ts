// src/Store/hooks/useProducts.ts
import { useEffect, useState } from 'react';

import {
  advancedSearchProducts,
  getDistinctBrands,
  getProductsBySearch,
} from '../Store/services/ProductService';

interface PaginatorState {
  totalPages: number;
  number: number;
  first: boolean;
  last: boolean;
}

interface UseProductsProps {
  searchTerm: string;
  category: string | null;
  pageNumber: number;
  sortBy: string;
  checkBoxInStock: boolean;
  selectedBrands: string[];
  selectedFlavors: string[];
  priceRange: number[];
}

interface UseProductsReturn {
  products: Product[];
  paginator: PaginatorState;
  loading: boolean;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  checkBoxInStock: boolean;
  setCheckBoxInStock: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBrands: string[];
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
  selectedFlavors: string[];
  setSelectedFlavors: React.Dispatch<React.SetStateAction<string[]>>;
  priceRange: number[];
  setPriceRange: React.Dispatch<React.SetStateAction<number[]>>;
  brands: string[];
}

export const useProducts = ({
  searchTerm,
  category,
  pageNumber,
  sortBy,
  checkBoxInStock,
  selectedBrands,
  selectedFlavors,
  priceRange,
}: UseProductsProps): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [paginator, setPaginator] = useState<PaginatorState>({
    totalPages: 0,
    number: 0,
    first: true,
    last: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [brands, setBrands] = useState<string[]>([]);

  const isSearching = searchTerm.trim() !== '';

  useEffect(() => {
    const fetchProductsAndBrands = async () => {
      setLoading(true);
      try {
        // Cargar productos
        if (isSearching) {
          const foundProducts = await getProductsBySearch(searchTerm);
          setProducts(foundProducts);
          setPaginator({ totalPages: 0, number: 0, first: true, last: true });
        } else {
          const filters = {
            category: category || null,
            inStock: checkBoxInStock ? true : undefined,
            brands: selectedBrands,
            flavors: selectedFlavors,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
          };

          const response = await advancedSearchProducts({
            page: pageNumber,
            size: 12,
            sortBy,
            ...filters,
          });

          setProducts(response.content);
          setPaginator({
            totalPages: response.totalPages,
            number: response.number,
            first: response.first,
            last: response.last,
          });
        }

        // Cargar marcas distintas
        const brandsResponse = await getDistinctBrands();
        console.log('Marcas obtenidas desde el backend:', brandsResponse);
        setBrands(brandsResponse);
      } catch (error) {
        console.error('Error al cargar productos o marcas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndBrands();
  }, [
    isSearching,
    searchTerm,
    category,
    pageNumber,
    sortBy,
    checkBoxInStock,
    selectedBrands,
    selectedFlavors,
    priceRange,
  ]);

  const [localSortBy, setLocalSortBy] = useState<string>(sortBy);

  useEffect(() => {
    setLocalSortBy(sortBy);
  }, [sortBy]);

  return {
    products,
    paginator,
    loading,
    sortBy: localSortBy,
    setSortBy,
    checkBoxInStock,
    setCheckBoxInStock: (value: boolean) => {},
    selectedBrands,
    setSelectedBrands: (brands: string[]) => {},
    selectedFlavors,
    setSelectedFlavors: (flavors: string[]) => {},
    priceRange,
    setPriceRange: (range: number[]) => {},
    brands,
  };
};
