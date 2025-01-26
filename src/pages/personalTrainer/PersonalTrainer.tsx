import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../Apis/apiConfig';
import InstagramIcon from '@mui/icons-material/Instagram'; 
import WhatsAppIcon from '@mui/icons-material/WhatsApp';


// Interfaces
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
  monthlyFee: number; 
  instagramUrl?: string | null;
  whatsappNumber?: string | null;
  certificationFileUrl?: string | null;
}

interface Plan {
  id: number;
  name: string;
  description?: string;
  price: number;          // Este ya es el PRECIO TOTAL del período (ej: 150000 anual)
  discount?: number;      // Porcentaje de descuento
  discountReason?: string;
  durationMonths?: number; // Cantidad de meses, ej: 12
}

const PersonalTrainerPage = () => {
  // Entrenadores
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Para mostrar spinner al crear preferencia de pago
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Plan seleccionado
  const [plan, setPlan] = useState<Plan | null>(null);

  // Leer parámetros de URL
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('planId');
  const onlyTrainer = searchParams.get('onlyTrainer') === 'true';

  // Auth y navegación
  const { isAuth, token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

 

  // 1. Cargar entrenadores y, si corresponde, cargar el plan
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await apiClient.get('/trainer-schedule/all-available');
    
        setTrainers(response.data);
      } catch (error) {
        console.error('Error fetching trainers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();

    // Si no es "onlyTrainer" y sí hay un planId, traer el plan
    if (!onlyTrainer && planId) {
      apiClient
        .get(`/plans/${planId}`)
        .then((res) => {
          setPlan(res.data);
        })
        .catch((err) => {
          console.error('Error fetching plan:', err);
        });
    }
  }, [planId, onlyTrainer]);

  // 2. Calcular precio total del plan (ya es el costo de TODO el período).
  //    Sólo aplicamos descuento si existe:
  const getPlanPriceFinal = () => {
    if (!plan) return 0;
    let finalPrice = plan.price; // precio TOTAL
    if (plan.discount && plan.discount > 0) {
      finalPrice = finalPrice - (finalPrice * (plan.discount / 100));
    }
    return finalPrice;
  };

  // 3. Al hacer clic en "Contratar Entrenador" o "Contratar Plan + Entrenador"
  const handleHireTrainer = async (trainerId: number) => {
    if (!isAuth) {
      alert('Por favor, inicia sesión para continuar.');
      // Guardar la ruta actual para redirigir tras login
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }

    if (!token) {
      alert('Token no encontrado. Por favor, inicia sesión nuevamente.');
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }

    // Construimos URL del endpoint
    let url = '/payment/create_plan_preference';
    if (onlyTrainer) {
      url += `?trainerId=${trainerId}&onlyTrainer=true`;
    } else {
      if (!planId) {
        alert('No se encontró el plan. Por favor, regresa y selecciona un plan.');
        navigate('/services');
        return;
      }
      url += `?planId=${planId}&trainerId=${trainerId}`;
    }

    setPaymentLoading(true); // Mostrar spinner
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await apiClient.post(url, {}, config);
      const preference = response.data;

      // Redirigir a la URL de Mercado Pago
      window.location.href = preference.initPoint;
    } catch (error) {
      setPaymentLoading(false); // Ocultar spinner si hay error
      console.error('Error al crear la preferencia de pago:', error);
      alert('Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.');
    }
  };

  // 4. Mientras cargamos entrenadores, mostramos un mensaje
  if (loading) {
    return <Typography>Cargando entrenadores...</Typography>;
  }

  // 5. Obtener el precio final del plan (ya con descuento)
  const planPriceFinal = getPlanPriceFinal();

  return (
    <Box sx={{ p: 4 }}>
      {/* Backdrop y spinner si estamos creando la preferencia de pago */}
      <Backdrop open={paymentLoading} sx={{ color: '#fff', zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Typography variant="h4" gutterBottom align="center">
        Selecciona tu Entrenador Personal
      </Typography>

      {/* Texto condicional según modo "onlyTrainer" */}
      {onlyTrainer ? (
        <Typography variant="body1" align="center" sx={{ mb: 4 }}>
          Has elegido contratar sólo el servicio de entrenador personal.
          Selecciona el entrenador que desees.
        </Typography>
      ) : (
        <Typography variant="body1" align="center" sx={{ mb: 4 }}>
          Has seleccionado el plan con ID: {planId}. Ahora elige el entrenador que más se ajuste a tus necesidades.
        </Typography>
      )}

      {/* Mostramos precio del plan (si no es onlyTrainer y sí hay plan) */}
      {!onlyTrainer && plan && (
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          {plan.discount && plan.discount > 0 ? (
            <>
              {/* Precio sin descuento tachado */}
              <Typography variant="body1" sx={{ textDecoration: 'line-through', color: 'gray' }}>
                Precio Normal del Plan: ${plan.price}
              </Typography>
              {/* Precio con descuento */}
              <Typography variant="h6" sx={{ color: 'red', fontWeight: 'bold' }}>
                Precio con Descuento: ${planPriceFinal.toFixed(2)}
              </Typography>
            </>
          ) : (
            // Sin descuento
            <Typography variant="h6">
              Precio del Plan: ${planPriceFinal.toFixed(2)}
            </Typography>
          )}
        </Box>
      )}

      <Grid container spacing={4}>
        {trainers.map((trainer) => {
          // Tarifa mensual del entrenador
          const monthlyFee = trainer.monthlyFee || 0;

          // SI QUIERES COBRAR 12 MESES DE ENTRENADOR (plan anual), puedes hacer:
          //   let trainerPrice = onlyTrainer ? monthlyFee : monthlyFee * (plan?.durationMonths ?? 1);
          // Pero si de momento sólo sumas "mes actual", dejas:
          const trainerPrice = onlyTrainer
            ? monthlyFee
            : monthlyFee * (plan?.durationMonths ?? 1);

          // Plan + Entrenador
          const total = plan ? planPriceFinal + trainerPrice : trainerPrice;

          return (
            <Grid item xs={12} sm={6} md={4} key={trainer.id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                  component="img"
                  height="240"
                  image={`${trainer.profileImageUrl}?v=${trainer.id}`}
                  alt={trainer.username}
                  sx={{ objectFit: 'cover' }}
                />
               <CardContent sx={{ flexGrow: 1 }}>
  <Typography variant="h6" gutterBottom>
    {trainer.username}
  </Typography>

  {/* Título del entrenador (opcional) */}
  {trainer.title && (
    <Typography variant="subtitle1">
      <strong>{trainer.title}</strong>
    </Typography>
  )}

  {/* Especialidad */}
  <Typography variant="body2" color="text.secondary">
    <strong>Especialidad:</strong> {trainer.specialization}
  </Typography>

  {/* Instagram (si existe) */}
{trainer.instagramUrl && (
  <Box display="flex" alignItems="center">
    <InstagramIcon sx={{ mr: 1 }} />
    <a href={trainer.instagramUrl} target="_blank" rel="noopener noreferrer">
      {trainer.instagramUrl}
    </a>
  </Box>
)}


  {/* WhatsApp (si existe) */}
{/* WhatsApp (si existe) */}
{trainer.whatsappNumber && (
  <Box display="flex" alignItems="center">
    <WhatsAppIcon sx={{ mr: 1, color: '#25D366' }} /> {/* Ícono de WhatsApp */}
    <a 
      href={`https://wa.me/${trainer.whatsappNumber}`} 
      target="_blank" 
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      {trainer.whatsappNumber}
    </a>
  </Box>
)}


  {/* Certificación PDF (si existe) */}
  {trainer.certificationFileUrl && (
    <Typography variant="body2" color="text.secondary">
      <strong>Certificado:</strong>{' '}
      <a 
        href={trainer.certificationFileUrl} 
        target="_blank" 
        rel="noopener noreferrer"
      >
        Ver PDF
      </a>
    </Typography>
  )}
                  {/* Más info del entrenador... */}

                  <Box sx={{ mt: 2 }}>
                    {/* Mostrar desglose */}
                    {onlyTrainer ? (
                      <Typography variant="body1">
                        Tarifa Entrenador (1 mes): <strong>${monthlyFee.toFixed(2)}</strong>
                      </Typography>
                    ) : (
                      <>
                        {/* Plan y entrenador */}
                        <Typography variant="body1">
                          Plan: ${planPriceFinal.toFixed(2)} + Entrenador: ${trainerPrice.toFixed(2)}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          Total: ${total.toFixed(2)}
                        </Typography>
                      </>
                    )}
                  </Box>
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
          );
        })}
      </Grid>
    </Box>
  );
};

export default PersonalTrainerPage;
