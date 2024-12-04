// src/Trainers/pages/TrainerProfileEditPage.tsx

import React, { useEffect } from 'react';
import { Box, Button, TextField, Typography, Avatar } from '@mui/material';
import { useAuth } from '../../Auth/hooks/useAuth';
import { updateTrainerProfile } from '../services/TrainerService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../../Auth/store/auth/authSlice';

export const TrainerProfileEditPage: React.FC = () => {
  const { login } = useAuth();
  const dispatch = useDispatch();

  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    username: Yup.string().required('El nombre de usuario es requerido'),
    email: Yup.string()
      .email('Correo electrónico no válido')
      .required('El correo es requerido'),
    password: Yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .notRequired(),
    file: Yup.mixed().notRequired(),
  });

  const initialValues = {
    username: login.user?.username || '',
    email: login.user?.email || '',
    password: '',
    file: null as File | null,
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('email', values.email);
    if (values.password) {
      formData.append('password', values.password);
    }
    if (values.file) {
      formData.append('file', values.file);
    }

    try {
      const updatedUser = await updateTrainerProfile(formData); // updatedUser es de tipo UserInterface
      console.log('Perfil actualizado:', updatedUser);

      // Actualizar el estado global con los nuevos datos del usuario
      dispatch(updateProfile(updatedUser));


      Swal.fire({
        icon: 'success',
        title: 'Perfil actualizado',
        text: 'Tu perfil ha sido actualizado exitosamente.',
      });
    } catch (error: any) {
      console.error('Error actualizando perfil:', error);
      // Mostrar SweetAlert de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data || 'Ocurrió un error al actualizar el perfil.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Editar Perfil
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, isSubmitting }) => {
          useEffect(() => {
            if (values.file) {
              const objectUrl = URL.createObjectURL(values.file);
              return () => URL.revokeObjectURL(objectUrl);
            }
          }, [values.file]);

          return (
            <Form>
              <Field
                as={TextField}
                name="username"
                label="Nombre de usuario"
                fullWidth
                margin="normal"
                helperText={<ErrorMessage name="username" />}
                error={Boolean(<ErrorMessage name="username" />)}
              />
              <Field
                as={TextField}
                name="email"
                type="email"
                label="Correo electrónico"
                fullWidth
                margin="normal"
                helperText={<ErrorMessage name="email" />}
                error={Boolean(<ErrorMessage name="email" />)}
              />
              <Field
                as={TextField}
                name="password"
                type="password"
                label="Nueva contraseña"
                fullWidth
                margin="normal"
                helperText={<ErrorMessage name="password" />}
                error={Boolean(<ErrorMessage name="password" />)}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Avatar
                  alt={login.user?.username}
                  src={
                    values.file
                      ? URL.createObjectURL(values.file)
                      : login.user?.profileImageUrl || ''
                  }
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <Button variant="contained" component="label">
                  Subir Imagen de Perfil
                  <input
                    type="file"
                    hidden
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files && e.target.files[0]) {
                        setFieldValue('file', e.target.files[0]);
                      }
                    }}
                    accept="image/*"
                  />
                </Button>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};
