// src/Admin/components/UseForm.tsx

import { useFormik } from 'formik';
import { UserInterface } from '../../Auth/Interfaces/UserInterface';
import { TextField, Button, Checkbox, FormControlLabel, Box, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useState } from 'react';

interface UserFormProps {
  userSelected: UserInterface;
  handlerAddUser: (user: UserInterface) => void;
  handlerCloseForm: () => void;
}

export const UserForm = ({ userSelected, handlerAddUser, handlerCloseForm }: UserFormProps) => {
  const [isTrainer, setIsTrainer] = useState(userSelected.trainer || false);

  // Definir el esquema de validación usando Yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .required('El nombre de usuario es obligatorio'),
    email: Yup.string()
      .email('Debe ser un email válido')
      .required('El email es obligatorio'),
    password: !userSelected.id
      ? Yup.string().required('La contraseña es obligatoria')
      : Yup.string(),
    admin: Yup.boolean(),
    trainer: Yup.boolean(),
    // Campos adicionales para Trainer
    specialization: isTrainer ? Yup.string().required('Especialización es requerida') : Yup.string(),
    experienceYears: isTrainer ? Yup.number().required('Años de experiencia son requeridos') : Yup.number(),
    availability: isTrainer ? Yup.boolean().required('Disponibilidad es requerida') : Yup.boolean(),
    monthlyFee: isTrainer ? Yup.number().required('Cuota mensual es requerida') : Yup.number(),
    title: isTrainer ? Yup.string().required('Título es requerido') : Yup.string(),
    studies: isTrainer ? Yup.string().required('Estudios son requeridos') : Yup.string(),
    certifications: isTrainer ? Yup.string().required('Certificaciones son requeridas') : Yup.string(),
    description: isTrainer ? Yup.string().required('Descripción es requerida') : Yup.string(),
    instagramUrl: Yup.string().notRequired(),
    whatsappNumber: Yup.string().notRequired()
  });

  const formik = useFormik({
    initialValues: {
      id: userSelected?.id || '',
      username: userSelected?.username || '',
      email: userSelected?.email || '',
      password: '',
      admin: userSelected?.admin || false,
      trainer: userSelected?.trainer || false,
      specialization: '',
      experienceYears: '',
      availability: false,
      monthlyFee: '',
      title: '',
      studies: '',
      certifications: '',
      description: '',
      instagramUrl: '',
      whatsappNumber: '',
      certificationFile: undefined,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handlerAddUser(values);
    },
  });
  

  const handleTrainerCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTrainer(e.target.checked);
    formik.handleChange(e);
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ overflowY: 'auto' }}>
      <TextField
        fullWidth
        margin="normal"
        label="Nombre de Usuario"
        name="username"
        value={formik.values.username}
        onChange={formik.handleChange}
        error={formik.touched.username && Boolean(formik.errors.username)}
        helperText={formik.touched.username && formik.errors.username}
      />

      {!formik.values.id && (
        <TextField
          fullWidth
          margin="normal"
          label="Contraseña"
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
      )}

      <TextField
        fullWidth
        margin="normal"
        label="Email"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={formik.values.admin}
            onChange={formik.handleChange}
            name="admin"
            color="primary"
          />
        }
        label="Admin"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={formik.values.trainer}
            onChange={handleTrainerCheckbox}
            name="trainer"
            color="primary"
          />
        }
        label="Entrenador"
      />

      {/* Mostrar campos adicionales si es Trainer */}
      {isTrainer && (
        <>
          <Typography variant="h6" sx={{ mt: 2 }}>Información del Entrenador</Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Especialización"
            name="specialization"
            value={formik.values.specialization}
            onChange={formik.handleChange}
            error={formik.touched.specialization && Boolean(formik.errors.specialization)}
            helperText={formik.touched.specialization && formik.errors.specialization}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Años de Experiencia"
            name="experienceYears"
            type="number"
            value={formik.values.experienceYears}
            onChange={formik.handleChange}
            error={formik.touched.experienceYears && Boolean(formik.errors.experienceYears)}
            helperText={formik.touched.experienceYears && formik.errors.experienceYears}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.availability}
                onChange={formik.handleChange}
                name="availability"
                color="primary"
              />
            }
            label="Disponible"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Cuota Mensual"
            name="monthlyFee"
            type="number"
            value={formik.values.monthlyFee}
            onChange={formik.handleChange}
            error={formik.touched.monthlyFee && Boolean(formik.errors.monthlyFee)}
            helperText={formik.touched.monthlyFee && formik.errors.monthlyFee}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Título"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Estudios"
            name="studies"
            value={formik.values.studies}
            onChange={formik.handleChange}
            error={formik.touched.studies && Boolean(formik.errors.studies)}
            helperText={formik.touched.studies && formik.errors.studies}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Certificaciones"
            name="certifications"
            value={formik.values.certifications}
            onChange={formik.handleChange}
            error={formik.touched.certifications && Boolean(formik.errors.certifications)}
            helperText={formik.touched.certifications && formik.errors.certifications}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Descripción"
            name="description"
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
<TextField
  fullWidth
  margin="normal"
  label="Instagram (opcional)"
  name="instagramUrl" // <--- sin "trainerDetails."
  value={formik.values.instagramUrl}
  onChange={formik.handleChange}
/>
<TextField
  fullWidth
  margin="normal"
  label="WhatsApp (opcional)"
  name="whatsappNumber"
  value={formik.values.whatsappNumber}
  onChange={formik.handleChange}
/>
<Typography variant="subtitle1" sx={{ mt: 2 }}>
      Certificación (PDF / imagen)
    </Typography>
    <input
      type="file"
      name="certificationFile"
      onChange={(e) => {
        if (e.currentTarget.files && e.currentTarget.files.length > 0) {
          formik.setFieldValue('certificationFile', e.currentTarget.files[0]);
        }
      }}
    />

        </>
      )}

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" type="submit">
          {formik.values.id ? 'Editar' : 'Crear'}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handlerCloseForm}
          sx={{ ml: 2 }}
        >
          Cerrar
        </Button>
      </Box>
    </Box>
  );
};
