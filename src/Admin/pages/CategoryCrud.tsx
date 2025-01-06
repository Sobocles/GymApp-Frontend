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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Box,
} from '@mui/material';

// Interfaces
interface Category {
  id?: number;
  name: string;
}

export const CategoryCrud: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Obtener todas las categorías
  const fetchCategories = async () => {
    try {
      const response = await apiClient.get<Category[]>('/store/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  // Eliminar categoría
  const handleDelete = async (categoryId: number) => {
    try {
      await apiClient.delete(`/store/categories/${categoryId}`);
      fetchCategories();
      alert('Categoría eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      alert('Ocurrió un error al eliminar la categoría');
    }
  };

  // Abrir modal para CREAR nueva categoría
  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setOpenDialog(true);
  };

  // Abrir modal para EDITAR categoría
  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setOpenDialog(true);
  };

  // Cerrar modal
  const handleCloseDialog = () => {
    setSelectedCategory(null);
    setOpenDialog(false);
  };

  // Validación con Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es requerido'),
  });

  // Manejar envío del formulario (crear/actualizar)
  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      if (selectedCategory) {
        // PUT /store/categories/{id}?newName=XXXX
        await apiClient.put(`/store/categories/${selectedCategory.id}`, null, {
          params: { newName: values.name },
        });
        alert('Categoría actualizada con éxito');
      } else {
        // POST /store/categories?name=XXXX
        await apiClient.post('/store/categories', null, {
          params: { name: values.name },
        });
        alert('Categoría creada con éxito');
      }

      // Refrescar la lista
      fetchCategories();
      // Resetear formulario
      resetForm();
      // Cerrar modal
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      alert('Ocurrió un error al guardar la categoría');
    }
  };

  return (
    <Box sx={{ margin: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Categorías
      </Typography>

      {/* Botón para crear una nueva categoría */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenCreate}
        sx={{ mb: 2 }}
      >
        Crear Categoría
      </Button>

      {/* Listado de categorías */}
      {categories.length === 0 ? (
        <Typography>No hay categorías registradas.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.id}</TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEdit(cat)}
                      sx={{ mr: 1 }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => cat.id && handleDelete(cat.id)}
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

      {/* Dialog (Modal) para crear/editar categoría */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <Formik
          initialValues={{
            name: selectedCategory?.name || '',
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, values }) => (
            <Form onSubmit={handleSubmit}>
              <DialogTitle>
                {selectedCategory ? 'Editar Categoría' : 'Crear Categoría'}
              </DialogTitle>

              <DialogContent dividers>
                {/* CAMPO NOMBRE */}
                <Field name="name">
                  {({ field }: any) => (
                    <TextField
                      {...field}
                      label="Nombre de la categoría"
                      fullWidth
                      margin="normal"
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="name"
                  render={(msg) => (
                    <Typography color="error" variant="body2">
                      {msg}
                    </Typography>
                  )}
                />
              </DialogContent>

              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancelar</Button>
                <Button type="submit" variant="contained" color="primary">
                  {selectedCategory ? 'Actualizar' : 'Crear'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Box>
  );
};
