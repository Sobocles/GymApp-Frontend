import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { getProductById, createProductPreference } from '../../Store/services/ProductService';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, increaseQuantity, decreaseQuantity, Product } from '../../Store/Store/slices/cartSlice';
import { RootState } from '../../store';

/**
 * Calcula la oferta de un producto si está en rango de fechas.
 * Retorna un objeto con:
 *   - originalPrice (number)
 *   - finalPrice (number)
 *   - isDiscountActive (boolean)
 *   - discountReason (string | null)
 */
function getDiscountedPrice(product: Product) {
  const now = new Date();
  
  const start = product.discountStart ? new Date(product.discountStart) : null;
  const end = product.discountEnd ? new Date(product.discountEnd) : null;

  let isDiscountActive = false;
  if (
    product.discountPercent &&
    product.discountPercent > 0 &&
    start && end &&
    now >= start &&
    now <= end
  ) {
    isDiscountActive = true;
  }

  const originalPrice = product.price;
  let finalPrice = product.price;
  
  if (isDiscountActive) {
    finalPrice = finalPrice - (finalPrice * product.discountPercent / 100);
  }

  return {
    originalPrice,
    finalPrice,
    isDiscountActive,
    discountReason: isDiscountActive ? product.discountReason : null
  };
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState<Product | null>(null);

  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { isAuth } = useSelector((state: RootState) => state.auth);

  // Si el producto ya está en el carrito, obtenemos su cantidad
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
        console.log("AQUI productData",productData);
        setProduct(productData);
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    };
    fetchProduct();
  }, [id]);

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

  // Comprar Ahora (redirige a MercadoPago)
  const handleBuyNow = async () => {
    if (!product) return;

    // Verificar autenticación antes de proceder
    if (!isAuth) {
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }

    // Calcular el precio final (con descuento si aplica)
    const { finalPrice } = getDiscountedPrice(product);

    // El payload se enviará con 'unitPrice' = precio con descuento en caso de oferta
    const payload = [
      {
        productId: product.id,    // O el ID real que corresponda
        unitPrice: finalPrice,
        quantity: 1,
      },
    ];
    

    try {
      const response = await createProductPreference(payload);
      console.log("aqui response",response);
      const { initPoint } = response;
      if (initPoint) {
        window.location.href = initPoint;
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Error al procesar el pago.');
    }
  };

  if (!product) {
    return <div>Cargando producto...</div>;
  }

  // Aplicamos la lógica de descuento para renderizar
  const {
    originalPrice,
    finalPrice,
    isDiscountActive,
    discountReason
  } = getDiscountedPrice(product);

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

      {/* Si hay descuento vigente mostramos precio tachado y precio final */}
      {isDiscountActive ? (
        <Box marginY={2}>
          <Typography
            variant="body2"
            sx={{ textDecoration: 'line-through', color: 'gray' }}
          >
            ${originalPrice.toFixed(2)}
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'red', fontWeight: 'bold' }}
          >
            ${finalPrice.toFixed(2)}
          </Typography>
          {discountReason && (
            <Typography
              variant="body2"
              sx={{ color: 'red', fontStyle: 'italic' }}
            >
              {discountReason}
            </Typography>
          )}
        </Box>
      ) : (
        <Typography variant="h6" gutterBottom>
          Precio: ${originalPrice.toFixed(2)}
        </Typography>
      )}

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
        <Button
          variant="contained"
          color="primary"
          onClick={handleBuyNow}
          sx={{ mr: 2 }}
        >
          Comprar ahora
        </Button>

        {/* Agregar al Carrito */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleAddToCart}
        >
          Agregar al Carrito
        </Button>
      </Box>
    </Box>
  );
};

export default ProductDetailPage;
