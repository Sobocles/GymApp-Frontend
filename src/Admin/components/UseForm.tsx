
import { useFormik } from 'formik';
import { UserInterface } from '../../Auth/Interfaces/UserInterface';
import { TextField, Button, Checkbox, FormControlLabel, Box } from '@mui/material';
import * as Yup from 'yup';

interface UserFormProps {
  userSelected: UserInterface;
  handlerAddUser: (user: UserInterface) => void;
  handlerCloseForm: () => void;
}

export const UserForm = ({ userSelected, handlerAddUser, handlerCloseForm }: UserFormProps) => {
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
  });

  const formik = useFormik({
    initialValues: {
      id: userSelected.id || undefined,
      username: userSelected.username || '',
      email: userSelected.email || '',
      password: '',
      admin: userSelected.admin || false,
      trainer: userSelected.trainer || false, 
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handlerAddUser(values);
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate>
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
            onChange={formik.handleChange}
            name="trainer"
            color="primary"
          />
        }
        label="Entrenador"
      />

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
