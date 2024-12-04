// src/components/layout/Header/Header.tsx

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { Link as RouterLink } from 'react-router-dom';

// Definir los elementos del menú
const navItems = [
  { label: 'Inicio', path: '/' },
  { label: 'Nosotros', path: '/about' },
  { label: 'Servicios', path: '/services' },
  { label: 'Contacto', path: '/contact' },
  { label: 'Iniciar Sesión', path: '/auth/login' },
  { label: 'Registrarse', path: '/auth/register' },
];

// Styled component para los botones de navegación
const NavButton = styled(Button)(({ theme }) => ({
  color: '#ffffff',
  margin: theme.spacing(1),
  transition: 'transform 0.3s, background-color 0.3s',
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: '#f50057', // Cambia a un color vibrante al pasar el mouse
    transform: 'scale(1.1)', // Aumenta el tamaño ligeramente
  },
  '&:active': {
    backgroundColor: '#c51162', // Color al hacer click
    transform: 'scale(1.05)', // Reducir un poco el efecto de hover
  },
}));

const Header: React.FC = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Logotipo del Gimnasio */}
        <FitnessCenterIcon sx={{ display: { xs: 'none', sm: 'block' }, mr: 1 }} />
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: '#ffffff',
            flexGrow: 1,
            display: { xs: 'none', sm: 'block' },
            fontWeight: 'bold',
          }}
        >
          GymPro
        </Typography>

        {/* Contenedor para los botones de navegación centrados */}
        <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
          {navItems.map((item) => (
            <NavButton
              key={item.label}
              component={RouterLink}
              to={item.path}
            >
              {item.label}
            </NavButton>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
