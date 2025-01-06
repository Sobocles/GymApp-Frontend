import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, CardActions, CardMedia, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../Apis/apiConfig';

interface Trainer {
  id: number;
  username: string;
  email: string;
  specialization: string;
  experienceYears: number;
  availability: boolean;
  profileImageUrl: string;
  title: string;
  studies: string;
  certifications: string;
  description: string;
}

const PersonalTrainerPage = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchParams] = useSearchParams();
  const planId = searchParams.get('planId');
  const onlyTrainer = searchParams.get('onlyTrainer') === 'true'; // NUEVO: Leemos el modo onlyTrainer

  const { isAuth, token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await apiClient.get('/trainer-schedule/all-available');
        console.log("fetchTrainers - Datos recibidos desde el backend:", response.data);
        setTrainers(response.data);
      } catch (error) {
        console.error('Error fetching trainers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  const handleHireTrainer = async (trainerId: number) => {
    console.log("handleHireTrainer - trainerId seleccionado:", trainerId);
    console.log("handleHireTrainer - planId actual:", planId);
    console.log("handleHireTrainer - onlyTrainer:", onlyTrainer);
  
    if (!isAuth) {
      console.log("handleHireTrainer - Usuario no autenticado, redirigiendo a login.");
      alert('Por favor, inicia sesión para continuar.');
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }
  
    if (!token) {
      console.log("handleHireTrainer - No se encontró token en el frontend.");
      alert('Token no encontrado. Por favor, inicia sesión nuevamente.');
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }
  
    // Construimos la URL de la preferencia dependiendo del modo
    let url = '/payment/create_plan_preference';
    if (onlyTrainer) {
      url += `?trainerId=${trainerId}&onlyTrainer=true`;
    } else {
      if (!planId) {
        console.log("handleHireTrainer - No se encontró el planId en modo plan+trainer.");
        alert('No se encontró el plan. Por favor, regresa y selecciona un plan.');
        navigate('/services');
        return;
      }
      url += `?planId=${planId}&trainerId=${trainerId}`;
    }
  
    try {
      console.log("handleHireTrainer - Enviando petición a:", url);
  
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
  
      const response = await apiClient.post(url, {}, config);
      console.log("handleHireTrainer - Respuesta del backend:", response.data);
      const preference = response.data;
      console.log(preference);
      window.location.href = preference.initPoint;
    } catch (error) {
      console.log("handleHireTrainer - Error al crear la preferencia de pago:", error);
      alert('Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.');
    }
  };

  if (loading) {
    return <Typography>Cargando entrenadores...</Typography>;
  }

  return (
    <Box sx={{ p:4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Selecciona tu Entrenador Personal
      </Typography>
      
      {/* Mostramos mensaje diferente dependiendo del modo */}
      {onlyTrainer ? (
        <Typography variant="body1" align="center" sx={{ mb:4 }}>
          Has elegido contratar sólo el servicio de entrenador personal. Selecciona el entrenador que desees.
        </Typography>
      ) : (
        <Typography variant="body1" align="center" sx={{ mb:4 }}>
          Has seleccionado el plan con ID: {planId}. Ahora elige el entrenador que más se ajuste a tus necesidades.
        </Typography>
      )}

      <Grid container spacing={4}>
        {trainers.map((trainer) => (
          <Grid item xs={12} sm={6} md={4} key={trainer.id}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <CardMedia
  component="img"
  height="240"
  image={`${trainer.profileImageUrl}?v=${trainer.id}`}  // Aquí se usa el id del entrenador
  alt={trainer.username}
  sx={{ objectFit: 'cover' }}
/>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {trainer.username}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {trainer.title || 'Entrenador Personal'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt:1 }}>
                  <strong>Especialidad:</strong> {trainer.specialization}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Experiencia:</strong> {trainer.experienceYears} años
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt:1 }}>
                  <strong>Estudios:</strong> {trainer.studies || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Certificaciones:</strong> {trainer.certifications || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt:1 }}>
                  {trainer.description || 'Entrenador con amplia experiencia ayudando a sus clientes a alcanzar sus objetivos.'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleHireTrainer(trainer.id)}
                >
                  {onlyTrainer ? 'Contratar Entrenador' : 'Contratar Plan + Entrenador'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PersonalTrainerPage;
