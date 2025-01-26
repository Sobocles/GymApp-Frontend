// src/components/ProductCrud/ProductCrud.tsx

import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, Paper, TableContainer } from '@mui/material';
import { useSearch } from '../../Admin/hooks/useSearch';
import { Paginator } from '../components/Paginator';
import { ProductList } from '../components/ProductList';
import { ProductModalForm } from '../components/ProductModalForm';
import { useProductCrud } from '../hooks/useProductCrud';

export const ProductCrud: React.FC = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const { page = '0' } = useParams();
  const currentPage = parseInt(page, 10);

  // Hook que maneja toda la lógica
  const {
    products,
    paginator,
    categories,
    selectedProduct,
    openDialog,

    handlerCreateProduct,
    handlerUpdateProduct,
    handlerDeleteProduct,
    handleOpenCreate,
    handleEdit,
    handleCloseDialog,
  } = useProductCrud(currentPage, searchTerm);

  return (
    <Box sx={{ margin: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Productos
      </Typography>

      {/* Botón crear */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenCreate}
        sx={{ mb: 2, mr: 2 }}
      >
        Crear Producto
      </Button>

      {/* Barra de búsqueda */}
      <TextField
        label="Buscar productos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="small"
        sx={{ mb: 2, width: '300px' }}
      />

      {products.length === 0 ? (
        <Typography>No hay productos registrados.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <ProductList
            products={products}
            onEdit={handleEdit}
            onDelete={handlerDeleteProduct}
          />
        </TableContainer>
      )}

      {/* Modal Form */}
      <ProductModalForm
        open={openDialog}
        onClose={handleCloseDialog}
        productSelected={selectedProduct}
        categories={categories}
        onCreate={handlerCreateProduct}
        onUpdate={handlerUpdateProduct}
      />

      {/* Paginador */}
      {paginator.totalPages > 1 && (
        <Paginator
          url="/admin/store/products"
          paginator={{
            number: paginator.number,
            totalPages: paginator.totalPages,
            first: paginator.first,
            last: paginator.last,
          }}
        />
      )}
    </Box>
  );
};
