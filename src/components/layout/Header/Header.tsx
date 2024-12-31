import React, { useState, MouseEvent, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem,
  IconButton, Badge, // agregados
} from '@mui/material';
import { styled } from '@mui/system';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getAllCategories, Category } from '../../../Store/services/CategoryService';
import { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const navItems = [
  { label: 'Inicio', path: '/' },
  { label: 'Nosotros', path: '/about' },
  { label: 'Servicios', path: '/services' },
  { label: 'Contacto', path: '/contact' },
  { label: 'Iniciar Sesión', path: '/auth/login' },
  { label: 'Registrarse', path: '/auth/register' },
];

// Styled button
const NavButton = styled(Button)(({ theme }) => ({
  color: '#ffffff',
  margin: theme.spacing(1),
  transition: 'transform 0.3s, background-color 0.3s',
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: '#f50057',
    transform: 'scale(1.1)',
  },
  '&:active': {
    backgroundColor: '#c51162',
    transform: 'scale(1.05)',
  },
}));

const Header: React.FC = () => {
  const navigate = useNavigate();

  // Menú de la tienda
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Menú/carrito desplegable
  const [anchorElCart, setAnchorElCart] = useState<null | HTMLElement>(null);

  // Categorías
  const [categories, setCategories] = useState<Category[]>([]);

  // Tomar items del carrito
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cat = await getAllCategories();
        setCategories(cat);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };
    loadCategories();
  }, []);

  // Manejo del menú de la tienda
  const handleStoreMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleStoreMenuClose = () => {
    setAnchorEl(null);
  };

  // Manejo del menú del carrito
  const handleCartClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorElCart(event.currentTarget);
  };
  const handleCartClose = () => {
    setAnchorElCart(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleStoreMenuClose();
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Logo */}
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

        {/* Menú principal */}
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

          {/* Menú desplegable de la tienda */}
          <NavButton onClick={handleStoreMenuOpen}>Tienda</NavButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleStoreMenuClose}
          >
            <MenuItem onClick={() => handleNavigate('/store')}>
              Ver Todos
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem
                key={cat.id}
                onClick={() => handleNavigate(`/store?category=${cat.name}`)}
              >
                {cat.name}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Icono de Carrito con badge */}
        <IconButton onClick={handleCartClick} sx={{ color: '#ffffff' }}>
          <Badge badgeContent={totalItems} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        {/* DESPLEGABLE DEL CARRITO */}
        <Menu
          anchorEl={anchorElCart}
          open={Boolean(anchorElCart)}
          onClose={handleCartClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Box sx={{ p: 2, minWidth: '300px' }}>
  {cartItems.length === 0 ? (
    <Typography variant="body1">No hay productos en el carrito</Typography>
  ) : (
    <>
      {cartItems.map((item) => (
        <Box
          key={item.product.id}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" alignItems="center">
            {/* Imagen del producto */}
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'cover',
                marginRight: '12px',
                borderRadius: '8px',
              }}
            />
            <Box>
              <Typography variant="body2">{item.product.name}</Typography>
              <Typography variant="body2">
                Cantidad: {item.quantity}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ ml: 2 }}>
            ${item.product.price * item.quantity}
          </Typography>
        </Box>
      ))}
      <Box mt={2}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            handleCartClose();
            navigate('/cart');
          }}
        >
          Ver Carrito
        </Button>
      </Box>
    </>
  )}
</Box>

        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
