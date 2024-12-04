// src/components/layout/Navbar/Navbar.tsx

import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../../Auth/hooks/useAuth';

const Navbar: React.FC = () => {
  const { login, handlerLogout } = useAuth();

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* Botón para abrir el menú lateral en dispositivos móviles (opcional) */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          // onClick={handleDrawerToggle} // Si tienes una función para manejar esto
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          GymApp
        </Typography>
        {login.isAuth && (
          <Button color="inherit" onClick={handlerLogout}>
            Cerrar Sesión
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
