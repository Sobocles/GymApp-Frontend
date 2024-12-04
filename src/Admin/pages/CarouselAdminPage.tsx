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
import { getCarouselImages, uploadCarouselImage } from '../../services';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const CarouselAdminPage: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [orderNumber, setOrderNumber] = useState<number>(0);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const data = await getCarouselImages();
      console.log('Datos recibidos del backend:', data);
      setImages(data);
    } catch (error) {
      console.error('Error al obtener imágenes:', error);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFile(null);
    setCaption('');
    setOrderNumber(0);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await uploadCarouselImage(selectedFile, caption, orderNumber, token);
      fetchImages();
      handleCloseModal();
    } catch (error) {
      console.error('Error al subir imagen:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Administrador de Carrusel
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
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
                {/* Aquí puedes agregar botones para editar o eliminar */}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal para agregar nueva imagen */}
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
            Subir Nueva Imagen
          </Typography>
          <TextField
            fullWidth
            label="Título"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Orden"
            type="number"
            value={orderNumber}
            onChange={(e) => setOrderNumber(Number(e.target.value))}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" component="label" fullWidth>
            Seleccionar Imagen
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {selectedFile && <Typography sx={{ mt: 1 }}>{selectedFile.name}</Typography>}
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            sx={{ mt: 2 }}
            disabled={!selectedFile}
          >
            Subir
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default CarouselAdminPage;
