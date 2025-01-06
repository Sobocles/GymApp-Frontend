import React, { useEffect, useState } from 'react';
import apiClient from '../../Apis/apiConfig';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Importaciones de Material UI
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Box,
} from '@mui/material';

interface Product {
  id?: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number; 

  imageUrl?: string;
}


interface Category {
  id: number;
  name: string;
}

export const ProductCrud: React.FC = () => {
  // Estados
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Para controlar la apertura/cierre del Modal
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get<Product[]>('/store/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get<Category[]>('/store/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  // Eliminar producto
  const handleDelete = async (productId: number) => {
    try {
      await apiClient.delete(`/store/products/${productId}`);
      fetchProducts();
      alert('Producto eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Ocurrió un error al eliminar el producto');
    }
  };

  // Abrir modal para CREAR un nuevo producto
  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setOpenDialog(true);
  };

  // Abrir modal para EDITAR producto
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  // Cerrar modal
  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setOpenDialog(false);
  };

  // Validación con Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es requerido'),
    description: Yup.string().required('La descripción es requerida'),
    category: Yup.string().required('La categoría es requerida'),
    price: Yup.number()
      .min(0, 'El precio debe ser mayor o igual a 0')
      .required('El precio es requerido'),
  });

  // Manejador de creación/edición de producto
  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('category', values.category);
      formData.append('price', values.price.toString());
      formData.append('stock', values.stock.toString());
   
      
      if (values.imageFile) {
        formData.append('image', values.imageFile);
      }
  
      if (selectedProduct) {
        await apiClient.put(`/store/products/${selectedProduct.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Producto actualizado con éxito');
      } else {
        await apiClient.post('/store/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Producto creado con éxito');
      }
  
      fetchProducts();
      resetForm();
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Ocurrió un error al guardar el producto');
    }
  };
  

  return (
    <Box sx={{ margin: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Productos
      </Typography>

      {/* Botón para crear un nuevo producto */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenCreate}
        sx={{ mb: 2 }}
      >
        Crear Producto
      </Button>

      {/* Listado de productos */}
      {products.length === 0 ? (
        <Typography>No hay productos registrados.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Descripción</strong></TableCell>
                <TableCell><strong>Categoría</strong></TableCell>
                <TableCell><strong>Precio</strong></TableCell>
                <TableCell><strong>Imagen</strong></TableCell>
                <TableCell><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  {/* Ajusta según cómo venga la categoría desde backend */}
                  <TableCell>
                    {typeof p.category === 'string'
                      ? p.category
                      : 'Sin categoría'}
                  </TableCell>
                  <TableCell>{p.price}</TableCell>
                  <TableCell>
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        width="50"
                        style={{ borderRadius: '4px' }}
                      />
                    ) : (
                      'Sin imagen'
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEdit(p)}
                      sx={{ mr: 1 }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => p.id && handleDelete(p.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog (Modal) para crear/editar producto */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {selectedProduct ? 'Editar Producto' : 'Crear Producto'}
        </DialogTitle>

        <Formik
          initialValues={{
            name: selectedProduct?.name || '',
            description: selectedProduct?.description || '',
            category: selectedProduct?.category || '',
            price: selectedProduct?.price || 0,
            stock: selectedProduct?.stock || 0,
            imageFile: null,
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, handleSubmit, values }) => (
            <Form onSubmit={handleSubmit}>
              <DialogContent dividers>
                {/* NOMBRE */}
                <Field name="name">
                  {({ field }: any) => (
                    <TextField
                      {...field}
                      label="Nombre"
                      fullWidth
                      margin="normal"
                      error={Boolean(field?.meta?.error && field?.meta?.touched)}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="name"
                  render={(msg) => <Typography color="error">{msg}</Typography>}
                />

                {/* DESCRIPCION */}
                <Field name="description">
                  {({ field }: any) => (
                    <TextField
                      {...field}
                      label="Descripción"
                      fullWidth
                      margin="normal"
                      multiline
                      rows={3}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="description"
                  render={(msg) => <Typography color="error">{msg}</Typography>}
                />

                {/* CATEGORIA */}
                <Field name="category">
                  {({ field }: any) => (
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="select-category-label">Categoría</InputLabel>
                      <Select
                        labelId="select-category-label"
                        label="Categoría"
                        {...field}
                        value={field.value || ''}
                      >
                        <MenuItem value="">
                          <em>Seleccione una categoría</em>
                        </MenuItem>
                        {categories.map((cat) => (
                          <MenuItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Field>
                <ErrorMessage
                  name="category"
                  render={(msg) => <Typography color="error">{msg}</Typography>}
                />

                {/* PRECIO */}
                <Field name="price">
                  {({ field }: any) => (
                    <TextField
                      {...field}
                      label="Precio"
                      type="number"
                      fullWidth
                      margin="normal"
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="price"
                  render={(msg) => <Typography color="error">{msg}</Typography>}
                />
                {/* STOCK */}
                <Field name="stock">
                  {({ field }: any) => (
                    <TextField
                      {...field}
                      label="Stock"
                      type="number"
                      fullWidth
                      margin="normal"
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="stock"
                  render={(msg) => <Typography color="error">{msg}</Typography>}
                />

        

                {/* IMAGEN */}
                <div style={{ marginTop: '1rem' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Imagen (opcional)
                  </Typography>
                  <input
                    type="file"
                    onChange={(event) => {
                      if (event.currentTarget.files?.[0]) {
                        setFieldValue('imageFile', event.currentTarget.files[0]);
                      }
                    }}
                  />
                  {/* Podrías mostrar un preview si quisieras */}
                </div>
              </DialogContent>

              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancelar</Button>
                <Button type="submit" variant="contained" color="primary">
                  {selectedProduct ? 'Actualizar' : 'Crear'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Box>
  );
};
