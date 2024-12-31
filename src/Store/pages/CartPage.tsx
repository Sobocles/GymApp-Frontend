import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';  // Importar useNavigate y useLocation
import { RootState } from '../../store';
import { 
  removeFromCart, 
  increaseQuantity, 
  decreaseQuantity 
} from '../Store/slices/cartSlice';
import { Box, Typography, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { createProductPreference } from '../services/ProductService';

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();  // Hook para navegación
  const location = useLocation();  // Hook para obtener la ruta actual

  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuth, token } = useSelector((state: RootState) => state.auth);  // Estado de autenticación

  // Calcular total
  const totalPrice = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5">Tu carrito está vacío</Typography>
      </Box>
    );
  }

  const handleCheckout = async () => {
    // Verificar autenticación antes de proceder
    if (!isAuth) {
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }
  
    const payload = items.map(item => ({
      unitPrice: item.product.price,
      quantity: item.quantity,
    }));
  
    try {
      const response = await createProductPreference(payload);
      const { initPoint } = response;
  
      if (initPoint) {
        window.location.href = initPoint;  // Redirige al checkout de MercadoPago
      }
    } catch (error) {
      console.error('Error al procesar el checkout:', error);
      alert('Error durante el proceso de compra.');
    }
  };
  

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Carrito de Compras
      </Typography>

      {items.map((item) => (
        <Box
        key={item.product.id}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ borderBottom: '1px solid #ccc', py: 1 }}
      >
        <Box display="flex" alignItems="center">
          <img
            src={item.product.imageUrl}
            alt={item.product.name}
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'cover',
              marginRight: '16px',
              borderRadius: '8px',
            }}
          />
          <Box>
            <Typography variant="h6">{item.product.name}</Typography>
            <Typography variant="body2">
              Precio: ${item.product.price.toFixed(2)}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <IconButton 
            color="primary" 
            onClick={() => dispatch(decreaseQuantity(item.product.id))}
          >
            <RemoveIcon />
          </IconButton>
          <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
          <IconButton 
            color="primary" 
            onClick={() => dispatch(increaseQuantity(item.product.id))}
          >
            <AddIcon />
          </IconButton>
          <IconButton 
            color="error" 
            onClick={() => dispatch(removeFromCart(item.product.id))}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      ))}

      <Box mt={2}>
        <Typography variant="h6">
          Total: ${totalPrice.toFixed(2)}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={handleCheckout}
        >
          Pagar Ahora
        </Button>
      </Box>
    </Box>
  );
};

export default CartPage;
