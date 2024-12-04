import { useEffect } from "react";
import { useAuth } from "../../Auth/hooks/useAuth";
import { useUsers } from "../hooks/useUsers";
import { UserModalForm } from "../components/useModalForm";
import { UsersList } from "../components/UsersList";
import { Box, Button, Typography } from '@mui/material';
import { useParams } from "react-router-dom";
import { Paginator } from "../components/Paginator";
import SearchBar from "../../components/common/SearchBar";

export const UsersPage = () => {
    const { page } = useParams(); // obtiene el parámetro de la ruta como string

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
        // Convertir 'page' a número antes de pasarlo a getUsers
        const pageNumber = page ? parseInt(page, 10) : 0;
        getUsers(pageNumber);
    }, [page]);

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
                  <Paginator url="/admin/users/page" paginator={paginator} />
                )}
              </>
            )}
          </Box>
        </>
      );
};
