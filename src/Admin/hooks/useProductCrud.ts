// src/components/ProductCrud/hooks/useProductCrud.ts

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  getAllProducts,
  getProductsPage,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories
} from '../../Store/services/ProductService';

import { Product } from '../../Store/interface/Product';

interface Category {
  id: number;
  name: string;
}

interface PaginatorState {
  number: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export const useProductCrud = (currentPage: number, searchTerm: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [paginator, setPaginator] = useState<PaginatorState>({
    number: 0,
    totalPages: 1,
    first: true,
    last: false,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Cargar categorías e inicial (similar a fetchAllAndFilter / fetchProductsPage)
  useEffect(() => {
    if (searchTerm.trim() === '') {
      fetchProductsPage();
      fetchCategories();
    } else {
      fetchAllAndFilter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm]);

  // Obtener productos paginados
  const fetchProductsPage = async () => {
    try {
      const data = await getProductsPage(currentPage, 6);
    
      setProducts(data.content);
      setPaginator({
        number: data.number,
        totalPages: data.totalPages,
        first: data.first,
        last: data.last,
      });
    } catch (error) {
      console.error('Error al obtener productos paginados:', error);
    }
  };

  // Obtener *todos* y filtrar en front
  const fetchAllAndFilter = async () => {
    try {
      const all = await getAllProducts();
      const filtered = all.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setProducts(filtered);
      setPaginator({
        number: 0,
        totalPages: 1,
        first: true,
        last: true,
      });
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  // Obtener categorías
  const fetchCategories = async () => {
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  // Crear producto
  const handlerCreateProduct = async (formData: FormData) => {
    try {
      await createProduct(formData);
      Swal.fire('Producto creado', 'El producto ha sido creado con éxito.', 'success');
      await fetchProductsPage();
    } catch (error) {
      console.error('Error al crear producto:', error);
      Swal.fire('Error', 'Ocurrió un error al guardar el producto.', 'error');
    }
  };

  // Editar producto
  const handlerUpdateProduct = async (id: number, formData: FormData) => {
    console.log("aqui la form data",formData);
    try {
      await updateProduct(id, formData);
      Swal.fire('Producto actualizado', 'El producto ha sido actualizado con éxito.', 'success');
      await fetchProductsPage();
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      Swal.fire('Error', 'Ocurrió un error al guardar el producto.', 'error');
    }
  };

  // Eliminar producto
  const handlerDeleteProduct = async (productId: number) => {
    try {
      await deleteProduct(productId);
      await fetchProductsPage();
      Swal.fire('Producto eliminado', 'El producto ha sido eliminado con éxito.', 'success');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      Swal.fire('Error', 'Ocurrió un error al eliminar el producto.', 'error');
    }
  };

  // Mostrar el modal en modo "Crear"
  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setOpenDialog(true);
  };

  // Mostrar el modal en modo "Editar"
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  // Cerrar modal
  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setOpenDialog(false);
  };

  return {
    products,
    paginator,
    categories,
    selectedProduct,
    openDialog,

    // funciones
    handlerCreateProduct,
    handlerUpdateProduct,
    handlerDeleteProduct,
    handleOpenCreate,
    handleEdit,
    handleCloseDialog,
  };
};
