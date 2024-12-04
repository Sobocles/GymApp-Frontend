
import Swal from "sweetalert2";
import {  findAllPages, remove, save, update } from "../services/UserService";
import { useDispatch, useSelector } from "react-redux";
import { initialUserForm, addUser, removeUser, updateUser, updatePaginator, loadingUsers, onUserSelectedForm, onOpenForm, onCloseForm, loadingError, initialErrors } from "../store/users/usersSlice";
import { useAuth } from "../../Auth/hooks/useAuth";
import { RootState } from "../../store";
import { UserInterface } from "../../Auth/Interfaces/UserInterface"
import { useEffect } from "react";
import { useSearch } from "./useSearch";
import { UserState } from "../../Admin/interface/Usertate"

interface ErrorResponse {
    status: number;
    data: {
        message?: string;
    };
}

export const useUsers = () => {
    
    const { users, userSelected, visibleForm, errors,  paginator } = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch();

    const { searchTerm, setSearchTerm } = useSearch();

    const { login, handlerLogout } = useAuth();

    const getUsers = async (page = 0) => {
      try {
        
        const result = await findAllPages(page, searchTerm);
    
        const usersData = result.data.content;
        const paginatorData = {
          number: result.data.number,
          totalPages: result.data.totalPages,
          first: result.data.first,
          last: result.data.last,
        };
        dispatch(loadingUsers(usersData));
        dispatch(updatePaginator(paginatorData));

      } catch (error) {
        console.error("[useUsers] Error al obtener usuarios:", error);

      }
    };
  
    useEffect(() => {
      console.log("[useUsers] useEffect - paginator.number:", paginator.number, "searchTerm:", searchTerm);
      getUsers(paginator.number);
    }, [paginator.number, searchTerm]); // getUsers se llama cada vez que cambia paginator.number o searchTerm
  

    const handlerAddUser = async (user: UserInterface) => {
        try {
          let response;
          if (!user.id) {
            // Crear nuevo usuario
            response = await save(user);
            dispatch(addUser(response.data));
          } else {
            // Actualizar usuario existente
            response = await update(user);
            dispatch(updateUser(response.data));
          }
          handlerCloseForm();
        } catch (error) {
          // Manejo de errores
          console.error(error);
        }
      };
      
    const handlerRemoveUser = (id: string) => {
        if (!login.isAdmin) return;
    
        Swal.fire({
            title: '¿Está seguro que desea eliminar?',
            text: "¡Cuidado, el usuario será eliminado!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await remove(id);
                    dispatch(removeUser(id));
    
                    Swal.fire(
                        'Usuario Eliminado!',
                        '¡El usuario ha sido eliminado con éxito!',
                        'success'
                    );
                } catch (error: unknown) {
                    if (error instanceof Error && 'response' in error) {
                        const response = (error as { response: ErrorResponse }).response;
    
                        if (response.status === 401) {
                            handlerLogout();
                        }
                    } else {
                        console.error("Unknown error:", error);
                    }
                }
            }
        });
    };
    

    const handlerUserSelectedForm = (user: UserInterface) => {
        const userWithPassword: UserState = { ...user, password: user.password ?? '' };
        console.log("AAAAAAAAAAAAAAA",userWithPassword);
        dispatch(onUserSelectedForm(userWithPassword));
    }
    
    

    const handlerOpenForm = () => {
        dispatch(onOpenForm());
    }

    const handlerCloseForm = () => {
        dispatch(onCloseForm());
        dispatch(loadingError({}));
    }
    return {
        users,
        userSelected,
        initialUserForm,
        visibleForm,
        errors,
        paginator,
        handlerAddUser,
        handlerRemoveUser,
        handlerUserSelectedForm,
        handlerOpenForm,
        handlerCloseForm,
        getUsers,
        searchTerm,
        setSearchTerm,
        
    }
} 