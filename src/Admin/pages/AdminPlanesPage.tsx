// src/Admin/pages/AdminPlanesPage.tsx

import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { usePlanes } from "../hooks/usePlanes";
import { Paginator } from "../components/Paginator";
// Reutiliza el mismo patrón de búsqueda
import { useSearch } from "../hooks/useSearch";
// Si tienes un SearchBar ya creado, por ejemplo:
import SearchBar from "../../components/common/SearchBar";

const AdminPlanesPage: React.FC = () => {
  // Obtenemos la página desde la URL
  const { page: pageParam } = useParams();
  const currentPage = parseInt(pageParam ?? "0", 10);

  // Usamos el hook para traer los planes (paginados)
  const { planes, paginator, isLoading, error } = usePlanes(currentPage);

  // Hook de búsqueda reutilizable
  const { searchTerm, setSearchTerm } = useSearch();

  // Filtrado en memoria si hay un término de búsqueda
  // Puedes elegir los campos según necesites (paymentId, planId, username, etc.)
  const filteredPlanes = !searchTerm
    ? planes
    : planes.filter((payment) => {
        return (
          payment.paymentId.toString().includes(searchTerm) ||
          payment.planId.toString().includes(searchTerm) ||
          payment.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (payment.personalTrainerName &&
            payment.personalTrainerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (payment.paymentMethod &&
            payment.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });

  if (isLoading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Cargando pagos aprobados de planes...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Facturas de Planes Aprobados
      </Typography>

      {/* Barra de búsqueda */}
      <SearchBar
        placeholder="Buscar por ID Pago, Usuario, Entrenador, etc."
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {filteredPlanes.length === 0 ? (
        <Typography variant="h6" sx={{ mt: 2 }}>
          {searchTerm
            ? "No se encontraron resultados para tu búsqueda."
            : "No hay facturas disponibles."}
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table aria-label="facturas de planes">
            <TableHead>
              <TableRow>
                <TableCell>ID del Pago</TableCell>
                <TableCell>ID del Plan</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Método de Pago</TableCell>
                <TableCell>Fecha de Pago</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Inicio Suscripción</TableCell>
                <TableCell>Fin Suscripción</TableCell>
                <TableCell>Inicio Subs. Entrenador</TableCell>
                <TableCell>Fin Subs. Entrenador</TableCell>
                <TableCell>Entrenador Personal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPlanes.map((payment) => (
                <TableRow key={payment.paymentId}>
                  <TableCell>{payment.paymentId}</TableCell>
                  <TableCell>{payment.planId}</TableCell>
                  <TableCell>{payment.username}</TableCell>
                  <TableCell>{payment.paymentMethod || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(payment.paymentDate).toLocaleString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    $
                    {payment.transactionAmount.toLocaleString("es-ES", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(payment.subscriptionStartDate).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(payment.subscriptionEndDate).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(payment.trainerSubscriptionStartDate).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(payment.trainerSubscriptionEndDate).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{payment.personalTrainerName || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* 
        Muestra el paginador solo si NO hay término de búsqueda 
        y si hay más de una página de resultados
      */}
      {searchTerm === "" && (
        <Paginator
          url="/admin/planes"
          paginator={{
            number: paginator.number,
            totalPages: paginator.totalPages,
            first: paginator.first,
            last: paginator.last,
          }}
        />
      )}
    </div>
  );
};

export default AdminPlanesPage;
