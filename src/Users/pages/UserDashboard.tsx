// src/Users/pages/UserDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, Grid, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import apiClient from '../../Apis/apiConfig';

interface Subscription {
  id: number;
  // Otros campos de la suscripción...
  plan?: {
    id: number;
    name: string;
    price: number;
  };
  startDate: string;
  endDate: string;
  active: boolean;
}

interface TrainerSubscription {
  id: number;
  startDate: string;
  endDate: string;
  active: boolean;
  personalTrainer: {
    id: number;
    specialization: string;
    monthlyFee: number;
    user: {
      username: string;
      email: string;
      profileImageUrl?: string | null;
    };
  };
}

interface PaymentDTO {
  id: number;
  planName: string;
  paymentDate?: string;
  paymentMethod: string;
  transactionAmount: number;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
}

interface DashboardData {
  planSubscriptions: Subscription[];
  payments: PaymentDTO[];
  trainerSubscriptions: TrainerSubscription[];
}

export const UserDashboard: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await apiClient.get('/users/dashboard', config);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [token]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido al Dashboard de Usuario
      </Typography>

      {data && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Suscripciones al Plan
          </Typography>
          {data.planSubscriptions.length === 0 && (
            <Typography>No tienes suscripciones a planes actualmente.</Typography>
          )}
          {data.planSubscriptions.map((sub) => (
            <Paper key={sub.id} sx={{ p:2, mb:2 }}>
              <Typography variant="h6">Suscripción Plan #{sub.id}</Typography>
              {sub.plan && (
                <Typography>
                  Plan: {sub.plan.name} - Precio: ${sub.plan.price}
                </Typography>
              )}
              <Typography>Inicio: {sub.startDate}</Typography>
              <Typography>Fin: {sub.endDate}</Typography>
              <Typography>Activa: {sub.active ? 'Sí' : 'No'}</Typography>
            </Paper>
          ))}

          <Divider sx={{ my:4 }} />

          <Typography variant="h5" gutterBottom>
            Suscripciones al Entrenador
          </Typography>
          {data.trainerSubscriptions.length === 0 && (
            <Typography>No tienes suscripciones a entrenadores actualmente.</Typography>
          )}
          {data.trainerSubscriptions.map((tsub) => (
            <Paper key={tsub.id} sx={{ p:2, mb:2 }}>
              <Typography variant="h6">Suscripción Entrenador #{tsub.id}</Typography>
              <Typography>
                Entrenador: {tsub.personalTrainer.user.username} - Especialidad: {tsub.personalTrainer.specialization}
              </Typography>
              <Typography>Mensualidad: ${tsub.personalTrainer.monthlyFee}</Typography>
              <Typography>Inicio: {tsub.startDate}</Typography>
              <Typography>Fin: {tsub.endDate}</Typography>
              <Typography>Activa: {tsub.active ? 'Sí' : 'No'}</Typography>
            </Paper>
          ))}

          <Divider sx={{ my:4 }} />

          <Typography variant="h5" gutterBottom>
            Pagos
          </Typography>
          {data.payments.length === 0 && (
            <Typography>No tienes pagos registrados actualmente.</Typography>
          )}
          {data.payments.map((pay) => (
            <Paper key={pay.id} sx={{ p:2, mb:2 }}>
              <Typography variant="h6">Pago #{pay.id}</Typography>
              <Typography>Plan/Servicio: {pay.planName}</Typography>
              <Typography>Método de pago: {pay.paymentMethod}</Typography>
              <Typography>Monto: ${pay.transactionAmount}</Typography>
              {pay.paymentDate && (
                <Typography>Fecha de pago: {new Date(pay.paymentDate).toLocaleString()}</Typography>
              )}
              {pay.subscriptionStartDate && (
                <Typography>
                  Suscripción desde: {pay.subscriptionStartDate} hasta {pay.subscriptionEndDate}
                </Typography>
              )}
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};
