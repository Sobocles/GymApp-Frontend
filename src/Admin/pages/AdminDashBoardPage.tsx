import React from 'react';
import { useFinancialData } from '../hooks/useFinancialData';

export const DashboardAdmin = () => {
  const { totalRevenue, adminRevenueData, loading, error } = useFinancialData();

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Bienvenido al Dashboard del Administrador</h1>

      {totalRevenue !== null && (
        <div>
          <h2>Ingresos Totales</h2>
          <p><strong>Total:</strong> {totalRevenue.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</p>
        </div>
      )}

      {adminRevenueData && (
        <div>
          <h2>Detalle de Ingresos</h2>
          <h3>Ingresos por Plan</h3>
          <ul>
            {Object.entries(adminRevenueData.planRevenue).map(([planName, amount]) => (
              <li key={planName}>
                {planName}: {amount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
              </li>
            ))}
          </ul>

          <h3>Ingresos por Tipo de Servicio</h3>
          <ul>
            <li>Entrenador Personal: {adminRevenueData.serviceRevenue.personalTrainer.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</li>
            <li>Plan + Entrenador: {adminRevenueData.serviceRevenue.planAndTrainer.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</li>
            <li>Solo Plan: {adminRevenueData.serviceRevenue.plan.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;
