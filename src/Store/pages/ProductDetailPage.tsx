import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {  getProductById } from '../../Store/services/ProductService';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, increaseQuantity, decreaseQuantity, Product } from '../../Store/Store/slices/cartSlice';
import { RootState } from '../../store';

import { createProductPreference } from '../../Store/services/ProductService';


const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [product, setProduct] = useState<Product | null>(null);
  
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { isAuth } = useSelector((state: RootState) => state.auth);

  const cartItem = cartItems.find(item => item.product.id === Number(id));
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    const fetchProduct = async () => {
      const productId = parseInt(id || '', 10);
      if (isNaN(productId)) {
        console.error('ID del producto no es válido:', id);
        return;
      }
      try {
        const productData = await getProductById(productId);
        setProduct(productData);
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    };
    fetchProduct();
  }, [id]);

  // Comprar Ahora (Redirige a MercadoPago)
  const handleBuyNow = async () => {
    if (!product) return;

    // Si no está autenticado, redirige a login y vuelve a la página de detalles
    if (!isAuth) {
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }

    const payload = [
      {
        unitPrice: product.price,
        quantity: 1,
      },
    ];

    try {
      const response = await createProductPreference(payload);
      const { initPoint } = response;
      if (initPoint) {
        window.location.href = initPoint;  // Redirige al checkout de MercadoPago
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Error al procesar el pago.');
    }
  };

  // Aumentar cantidad
  const handleIncrease = () => {
    if (!cartItem && product) {
      dispatch(addToCart({ product, quantity: 1 }));
    } else if (cartItem) {
      dispatch(increaseQuantity(cartItem.product.id));
    }
  };

  // Disminuir cantidad
  const handleDecrease = () => {
    if (cartItem && cartItem.quantity > 1) {
      dispatch(decreaseQuantity(cartItem.product.id));
    }
  };

  // Agregar al Carrito
  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product, quantity: 1 }));
    }
  };

  if (!product) {
    return <div>Cargando producto...</div>;
  }

  return (
    <Box display="flex" flexDirection="column" padding={2}>
      <Typography variant="h4" gutterBottom>
        {product.name}
      </Typography>

      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ width: '300px', marginBottom: '16px' }}
        />
      )}

      <Typography variant="body1" gutterBottom>
        {product.description || 'Sin descripción disponible.'}
      </Typography>

      <Typography variant="h6" gutterBottom>
        Precio: ${product.price.toFixed(2)}
      </Typography>

      <Typography variant="body1">
        Cantidad en el carrito: {quantityInCart}
      </Typography>

      <Box display="flex" alignItems="center" marginTop={2}>
        <IconButton onClick={handleDecrease} color="primary">
          <RemoveIcon />
        </IconButton>
        <Typography>{quantityInCart}</Typography>
        <IconButton onClick={handleIncrease} color="primary">
          <AddIcon />
        </IconButton>
      </Box>

      <Box marginTop={2}>
        {/* Comprar Ahora (Requiere autenticación) */}
        <Button variant="contained" color="primary" onClick={handleBuyNow}>
          Comprar ahora
        </Button>

        {/* Agregar al Carrito (No requiere autenticación) */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleAddToCart}
          sx={{ ml: 2 }}
        >
          Agregar al Carrito
        </Button>
      </Box>
    </Box>
  );
};

export default ProductDetailPage;
