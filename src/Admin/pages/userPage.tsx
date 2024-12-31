import React, { useEffect } from "react";
import { useAuth } from "../../Auth/hooks/useAuth";
import { useUsers } from "../hooks/useUsers";
import { UserModalForm } from "../components/useModalForm";
import { UsersList } from "../components/UsersList";
import { Box, Button, Typography } from '@mui/material';
import { useLocation } from "react-router-dom";
import { Paginator } from "../components/Paginator";
import SearchBar from "../../components/common/SearchBar";

export const UsersPage = () => {
    const location = useLocation();  // Obtenemos la ubicación actual
    const queryParams = new URLSearchParams(location.search);
const page = parseInt(queryParams.get('page') || '0', 10);


    const {
        users,
        visibleForm,
        handlerOpenForm,
        paginator,
        searchTerm,
        setSearchTerm,
        getUsers,
      } = useUsers();

    const { login } = useAuth();

    useEffect(() => {
        getUsers(page);  // Llamamos a getUsers con la página correcta
    }, [page, searchTerm]);  // Escuchamos los cambios de página y términos de búsqueda

    return (
        <>
          {visibleForm && <UserModalForm />}
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Users App
            </Typography>
            {(visibleForm || !login.isAdmin) || (
              <Button
                variant="contained"
                color="primary"
                onClick={handlerOpenForm}
                sx={{ mb: 2 }}
              >
                Nuevo Usuario
              </Button>
            )}
            {/* Barra de búsqueda */}
            <SearchBar
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            {users.length === 0 ? (
              <Typography variant="body1">
                No hay usuarios en el sistema!
              </Typography>
            ) : (
              <>
                <UsersList />
                {/* Mostrar el paginador solo si no hay término de búsqueda */}
                {searchTerm === '' && (
                  <Paginator
                  url="/admin/users"
                  paginator={{
                    number: paginator.number,
                    totalPages: paginator.totalPages,
                    first: paginator.first,
                    last: paginator.last,
                  }}
                />
                
                )}
              </>
            )}
          </Box>
        </>
      );
};
