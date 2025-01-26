import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Modal,
  TextField,
} from '@mui/material';
import { getCarouselImages, uploadCarouselImage, updateCarouselImage, deleteCarouselImage } from '../../Admin/services/carouselService';


const CarouselAdminPage: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [orderNumber, setOrderNumber] = useState<number>(0);
  const [editingId, setEditingId] = useState<number | null>(null);


  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const data = await getCarouselImages();
      console.log("ACA LA DATA DEL CARROUSEL",data);
      setImages(data);
    } catch (error) {
      console.error('Error al obtener imágenes:', error);
    }
  };

  const handleOpenModal = (image?: any) => {
    if (image) {
      setEditingId(image.id);
      setCaption(image.caption);
      setOrderNumber(image.orderNumber);
    } else {
      setEditingId(null);
      setCaption('');
      setOrderNumber(0);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFile(null);
    setCaption('');
    setOrderNumber(0);
    setEditingId(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await uploadCarouselImage(selectedFile, caption, orderNumber);
      fetchImages();
      handleCloseModal();
    } catch (error) {
      console.error('Error al subir imagen:', error);
    }
  };
  


  const handleUpdate = async () => {
    if (editingId === null) return;
  
    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('order', orderNumber.toString());
  
      // Incluir archivo solo si se seleccionó uno nuevo
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
  
      console.log('FormData enviado:', formData);
  
      // Llamar al servicio con el FormData
      await updateCarouselImage(editingId, formData);
      fetchImages(); // Refrescar las imágenes
      handleCloseModal(); // Cerrar el modal
    } catch (error) {
      console.error('Error al actualizar imagen:', error);
    }
  };
  
  
  
  const handleDelete = async (id: number) => {
    try {
      await deleteCarouselImage(id);
      fetchImages();
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
    }
  };
  

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Administrador de Carrusel
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
        Agregar Nueva Imagen
      </Button>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {images.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={image.imageUrl}
                alt={image.caption}
              />
              <CardContent>
                <Typography variant="h6">{image.caption}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Orden: {image.orderNumber}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="secondary" onClick={() => handleOpenModal(image)}>
                  Editar
                </Button>
                <Button size="small" color="error" onClick={() => handleDelete(image.id)}>
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal para agregar o editar imagen */}
      <Modal open={openModal} onClose={handleCloseModal}>
  <Box
    sx={{
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
    }}
  >
    <Typography variant="h6" gutterBottom>
      {editingId ? 'Editar Imagen' : 'Subir Nueva Imagen'}
    </Typography>
    <TextField
      fullWidth
      label="Título"
      value={caption ?? ''}
      onChange={(e) => setCaption(e.target.value)}
      sx={{ mb: 2 }}
    />
    <TextField
      fullWidth
      label="Orden"
      type="number"
      value={orderNumber ?? 0}
      onChange={(e) => setOrderNumber(Number(e.target.value))}
      sx={{ mb: 2 }}
    />

    <Button variant="contained" component="label" fullWidth>
      {selectedFile ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
      <input type="file" hidden onChange={handleFileChange} />
    </Button>
    {selectedFile && <Typography sx={{ mt: 1 }}>{selectedFile.name}</Typography>}

    {/* Contenedor para centrar el botón */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mt: 2,
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={editingId ? handleUpdate : handleUpload}
        disabled={!selectedFile && !editingId}
      >
        {editingId ? 'Actualizar' : 'Subir'}
      </Button>
    </Box>
  </Box>
</Modal>

    </Box>
  );
};

export default CarouselAdminPage;
