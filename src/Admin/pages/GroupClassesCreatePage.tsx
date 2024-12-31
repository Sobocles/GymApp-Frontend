// src/Admin/pages/GroupClassesCreatePage.tsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { useGroupClasses } from '../../Admin/hooks/useGroupClasses';

const validationSchema = Yup.object({
  className: Yup.string().required('El nombre de la clase es requerido'),
  startTime: Yup.string().required('La fecha/hora de inicio es requerida'),
  endTime: Yup.string().required('La fecha/hora de fin es requerida'),
  maxParticipants: Yup.number().required('El número máximo de participantes es requerido').min(1, 'Debe ser mayor a 0'),
});

export const GroupClassesCreatePage: React.FC = () => {
  const { handleCreateClass, loading, error } = useGroupClasses();

  const formik = useFormik({
    initialValues: {
      className: '',
      startTime: '',
      endTime: '',
      maxParticipants: 20,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await handleCreateClass(values);
        alert('Clase creada con éxito');
        formik.resetForm();
      } catch (err: any) {
        console.error('Error al crear la clase:', err);
      }
    },
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Crear Clase Grupal
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Nombre de la Clase"
          name="className"
          value={formik.values.className}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.className && Boolean(formik.errors.className)}
          helperText={formik.touched.className && formik.errors.className}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Fecha/Hora de Inicio (ISO 8601)"
          name="startTime"
          placeholder="2024-12-19T08:00:00"
          value={formik.values.startTime}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.startTime && Boolean(formik.errors.startTime)}
          helperText={formik.touched.startTime && formik.errors.startTime}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Fecha/Hora de Fin (ISO 8601)"
          name="endTime"
          placeholder="2024-12-19T09:00:00"
          value={formik.values.endTime}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.endTime && Boolean(formik.errors.endTime)}
          helperText={formik.touched.endTime && formik.errors.endTime}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Máximo de participantes"
          name="maxParticipants"
          type="number"
          value={formik.values.maxParticipants}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.maxParticipants && Boolean(formik.errors.maxParticipants)}
          helperText={formik.touched.maxParticipants && formik.errors.maxParticipants}
          margin="normal"
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Clase'}
        </Button>
      </Box>
    </Container>
  );
};
