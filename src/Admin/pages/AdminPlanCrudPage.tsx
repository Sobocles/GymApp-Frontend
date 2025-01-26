import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import apiClient from '../../Apis/apiConfig'; 

interface IPlan {
  id?: number;
  name: string;
  price: number;
  description?: string;
  discount?: number;
  discountReason?: string; // <-- nuevo
  versionNumber?: number;
  active?: boolean;
}

const AdminPlanCrudPage: React.FC = () => {
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  // Estado del form
  const [planData, setPlanData] = useState<IPlan>({
    name: '',
    price: 0,
    description: '',
    discount: 0,
    discountReason: '' // <-- nuevo
  });

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/plans'); // Ajusta la ruta si es distinta
      setPlans(response.data);
    } catch (err: any) {
      console.error('Error al obtener planes:', err);
      setError('No se pudo obtener la lista de planes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleOpenCreate = () => {
    setDialogMode('create');
    setPlanData({ name: '', price: 0, description: '', discount: 0, discountReason: '' });
    setSelectedPlanId(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (plan: IPlan) => {
    setDialogMode('edit');
    setSelectedPlanId(plan.id || null);
    setPlanData({
      name: plan.name,
      price: plan.price,
      description: plan.description || '',
      discount: plan.discount || 0,
      discountReason: plan.discountReason || '', // <-- nuevo
      versionNumber: plan.versionNumber,
      active: plan.active
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (dialogMode === 'create') {
      try {
        await apiClient.post('/plans', planData);
        setOpenDialog(false);
        fetchPlans();
      } catch (err) {
        console.error('Error al crear plan:', err);
        alert('Ocurrió un error al crear el plan.');
      }
    } else if (dialogMode === 'edit' && selectedPlanId) {
      try {
        await apiClient.put(`/plans/${selectedPlanId}`, planData);
        setOpenDialog(false);
        fetchPlans();
      } catch (err) {
        console.error('Error al actualizar plan:', err);
        alert('Ocurrió un error al actualizar el plan.');
      }
    }
  };

  const handleArchive = async (id: number) => {
    if (!window.confirm('¿Estás seguro de archivar (desactivar) este plan?')) return;
    try {
      await apiClient.delete(`/plans/${id}`);
      fetchPlans();
    } catch (err) {
      console.error('Error al archivar el plan:', err);
      alert('No se pudo archivar el plan.');
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ my: 3 }}>
        Gestión de Planes
      </Typography>

      <Button variant="contained" color="primary" onClick={handleOpenCreate} sx={{ mb: 2 }}>
        Crear Nuevo Plan
      </Button>

      {loading && <Typography>Cargando planes...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && plans.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Descuento (%)</TableCell>
              <TableCell>Razón Descuento</TableCell>{/* Nuevo */}
              <TableCell>Versión</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.id}</TableCell>
                <TableCell>{plan.name}</TableCell>
                <TableCell>${plan.price}</TableCell>
                <TableCell>{plan.discount || 0}%</TableCell>
                <TableCell>{plan.discountReason || '--'}</TableCell>
                <TableCell>{plan.versionNumber}</TableCell>
                <TableCell>{plan.active ? 'Sí' : 'No'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    color="info"
                    onClick={() => handleOpenEdit(plan)}
                    sx={{ mr: 1 }}
                  >
                    Editar/Versionar
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="warning"
                    onClick={() => handleArchive(plan.id!)}
                  >
                    Archivar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Crear Plan' : 'Editar / Versionar Plan'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            variant="outlined"
            fullWidth
            margin="normal"
            value={planData.name}
            onChange={(e) => setPlanData({ ...planData, name: e.target.value })}
          />
          <TextField
            label="Precio"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={planData.price}
            onChange={(e) => setPlanData({ ...planData, price: Number(e.target.value) })}
          />
          <TextField
            label="Descripción"
            variant="outlined"
            fullWidth
            margin="normal"
            value={planData.description}
            onChange={(e) => setPlanData({ ...planData, description: e.target.value })}
          />
          <TextField
            label="Descuento (%)"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={planData.discount}
            onChange={(e) => setPlanData({ ...planData, discount: Number(e.target.value) })}
          />
          <TextField
            label="Razón del Descuento"
            variant="outlined"
            fullWidth
            margin="normal"
            value={planData.discountReason}
            onChange={(e) => setPlanData({ ...planData, discountReason: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {dialogMode === 'create' ? 'Crear' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPlanCrudPage;
