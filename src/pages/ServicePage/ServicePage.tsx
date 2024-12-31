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
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../Apis/apiConfig';

interface Plan {
  id: number;
  name: string;
  price: number;
  description?: string;
  discount?: number;
}

const ServicePage = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

    try {
      if (!token) {
        alert('Token no encontrado. Por favor, inicia sesión nuevamente.');
        navigate('/auth/login', { state: { from: location.pathname } });
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await apiClient.post(`/payment/create_preference?planId=${planId}`,
        {},
        config
      );

      const preference = response.data;
      window.location.href = preference.initPoint;
    } catch (error) {
      console.error('Error al crear la preferencia de pago:', error);
      alert('Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.');
    }
  };

  const handlePlanPlusTrainer = (planId: number) => {
    if (!isAuth) {
      alert('Por favor, inicia sesión para continuar.');
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }
    // Redirige a escoger entrenador con plan
    navigate(`/personal-trainer?planId=${planId}`);
  };

  // NUEVO: Agregamos un handler para solo entrenador
  const handleOnlyTrainer = () => {
    if (!isAuth) {
      alert('Por favor, inicia sesión para continuar.');
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }
    // Redirige a escoger entrenador sin plan (onlyTrainer=true)
    navigate(`/personal-trainer?onlyTrainer=true`);
  };

  if (loading) {
    return <Typography>Cargando planes...</Typography>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Nuestros Planes
      </Typography>
      <Grid container spacing={4}>
        {plans.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={`/images/plans/plan-${plan.id}.jpg`}
                alt={plan.name}
              />
              <CardContent>
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
                      sx={{ marginTop: 2, textDecoration: 'line-through' }}
                      color="text.secondary"
                    >
                      Precio: ${plan.price}
                    </Typography>
                    <Typography variant="h6" color="error">
                      Precio con descuento: ${plan.price - plan.price * (plan.discount / 100)}
                    </Typography>
                    <Typography variant="body1" color="error">
                      Descuento: {plan.discount}%
                    </Typography>
                  </>
                ) : (
                  <Typography variant="h6" sx={{ marginTop: 2 }}>
                    Precio: ${plan.price}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleSubscribe(plan.id)}
                >
                  Comprar solo el Plan
                </Button>
              </CardActions>
              <CardActions>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => handlePlanPlusTrainer(plan.id)}
                >
                  Comprar Plan + Personal Trainer
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* NUEVO: Botón para contratar solo entrenador sin plan */}
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
