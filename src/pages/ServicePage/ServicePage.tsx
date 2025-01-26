import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../Apis/apiConfig';
import { Plan } from '../../Interface/Plan.ts';
import PesasCadaDia from '../../assets/Pesas-cada-dia.jpg';


const ServicePage = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // NUEVO: estado para mostrar el spinner al solicitar pago
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);

  const { isAuth, token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await apiClient.get('/plans');
        setPlans(response.data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (planId: number) => {
    if (!isAuth) {
      alert('Por favor, inicia sesión para continuar.');
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }

    // Activa el spinner
    setPaymentLoading(true);

    try {
      if (!token) {
        alert('Token no encontrado. Por favor, inicia sesión nuevamente.');
        navigate('/auth/login', { state: { from: location.pathname } });
        setPaymentLoading(false); // Apagar spinner
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await apiClient.post(`/payment/create_plan_preference?planId=${planId}`, {}, config);
      
      const preference = response.data;
      window.location.href = preference.initPoint;  // Redirección MercadoPago
    } catch (error) {
      console.error('Error al crear la preferencia de pago:', error);
      alert('Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.');
      setPaymentLoading(false); // Apagar spinner si ocurre error
    }
  };

  const handlePlanPlusTrainer = (planId: number) => {
    if (!isAuth) {
      alert('Por favor, inicia sesión para continuar.');
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }

    // Aquí NO llamas al backend directamente, solo navegas.
    // Entonces NO necesitas spinner. O si quieres, lo puedes poner.
    navigate(`/personal-trainer?planId=${planId}`);
  };

  const handleOnlyTrainer = () => {
    if (!isAuth) {
      alert('Por favor, inicia sesión para continuar.');
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }
    navigate(`/personal-trainer?onlyTrainer=true`);
  };

  if (loading) {
    return <Typography>Cargando planes...</Typography>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      {/* SPINNER (BACKDROP) */}
      <Backdrop open={paymentLoading} sx={{ color: '#fff', zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Typography variant="h4" align="center" gutterBottom>
        Nuestros Planes
      </Typography>

      <Grid container spacing={4}>
        {plans.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <CardMedia
  component="img"
  height="160"
  image={PesasCadaDia}
  alt="Pesas cada día"
/>

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="div">
                  {plan.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {plan.description || 'Descripción del plan'}
                </Typography>

                {plan.discount ? (
                  <>
                    <Typography
                      variant="h6"
                      sx={{ mt: 2, textDecoration: 'line-through', color: 'gray' }}
                    >
                      Precio Normal: ${plan.price}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ color: 'red', fontWeight: 'bold' }}
                    >
                      Precio con Descuento: ${ plan.price - plan.price * (plan.discount / 100) }
                    </Typography>
                    <Typography variant="body1" color="error" sx={{ fontStyle: 'italic' }}>
                      Descuento: {plan.discount}%
                      {plan.discountReason && ` — ${plan.discountReason}`}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Precio: ${plan.price}
                  </Typography>
                )}
              </CardContent>

              <CardActions
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'center', // Asegura que los elementos estén centrados horizontalmente
                    justifyContent: 'center', // Opcional, asegura una mejor alineación vertical
                    gap: 1, // Espaciado uniforme entre los botones
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    Comprar solo el Plan
                  </Button>

                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={() => handlePlanPlusTrainer(plan.id)}
                  >
                    Comprar Plan + Personal Trainer
                  </Button>

                  <Typography
                    variant="caption"
                    sx={{
                      textAlign: 'center',
                      mt: 1,
                    }}
                  >
                    *El precio final varía según la tarifa del entrenador
                  </Typography>
                </CardActions>

            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h5">¿Quieres solo un entrenador personal?</Typography>
        <Button variant="contained" color="primary" onClick={handleOnlyTrainer}>
          Contratar Sólo Personal Trainer
        </Button>
      </Box>
    </Box>
  );
};

export default ServicePage;
