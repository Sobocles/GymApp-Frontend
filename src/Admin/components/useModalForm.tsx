import React from 'react';
import { useUsers } from '../hooks/useUsers';
import { UserForm } from './UseForm';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const UserModalForm = () => {
  const { userSelected, visibleForm, handlerCloseForm, handlerAddUser } = useUsers();

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={visibleForm}
      onClose={handlerCloseForm}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography id="modal-title" variant="h6" component="h2">
            {userSelected.id ? 'Editar' : 'Crear'} Usuario
          </Typography>
          <IconButton aria-label="close" onClick={handlerCloseForm}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box id="modal-description" sx={{ mt: 2 }}>
          <UserForm
            userSelected={userSelected}
            handlerAddUser={handlerAddUser}
            handlerCloseForm={handlerCloseForm}
          />
        </Box>
      </Box>
    </Modal>
  );
};
