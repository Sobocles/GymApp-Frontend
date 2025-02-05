import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
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
  discountReason?: string; 
  versionNumber?: number;
  active?: boolean;
  durationMonths?: number; 
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
    discountReason: '',
    durationMonths: 1 
  });

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/plans'); 
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
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al crear el plan.',
        });
      }
    } else if (dialogMode === 'edit' && selectedPlanId) {
      try {
        await apiClient.put(`/plans/${selectedPlanId}`, planData);
        setOpenDialog(false);
        fetchPlans();
      } catch (err) {
        console.error('Error al actualizar plan:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar el plan.',
        });
      }
    }
  };


  const handleArchive = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres archivar (desactivar) este plan?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, archivar!',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;
    
    try {
      await apiClient.delete(`/plans/${id}`);
      fetchPlans();
    } catch (err) {
      console.error('Error al archivar el plan:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo archivar el plan.',
      });
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
              label="Duración (meses)"
              type="number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={planData.durationMonths}
              onChange={(e) => setPlanData({ ...planData, durationMonths: Number(e.target.value) })}
              inputProps={{ min: 1 }}
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
