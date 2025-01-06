// src/Auth/hooks/useAuth.ts

import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { loginUser } from '../services/authService';
import { useDispatch, useSelector } from 'react-redux';
import { onLogin, onLogout, updateProfile } from '../store/auth/authSlice';

import { RootState } from '../../store';
import { AxiosError } from 'axios';
import { UserInterface } from '../Interfaces/UserInterface';
import apiClient from '../../Apis/apiConfig';
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAdmin, trainer, isAuth, roles, token } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();

  // Handler para el login
  const handlerLogin = async (
    { email, password }: LoginCredentials,
    from?: string // Agregamos el parámetro 'from' opcional
  ) => {
    try {
      const response = await loginUser({ email, password });

      console.log("ACA LA OTRA RESPONSE", response);

      const token = response.data.token;
      const claims = JSON.parse(window.atob(token.split(".")[1]));

      console.log('ACA LOS CLAMIS Claims:', claims);
      console.log('Authorities:', claims.authorities);

      // Extraer roles
      let rolesArray: string[] = [];
      if (claims.authorities) {
        let authorities;
        if (typeof claims.authorities === 'string') {
          // Parseamos la cadena JSON
          try {
            authorities = JSON.parse(claims.authorities);
          } catch (e) {
            authorities = [];
          }
        } else {
          authorities = claims.authorities;
        }

        if (Array.isArray(authorities)) {
          rolesArray = authorities.map((roleObj: any) => {
            if (typeof roleObj === 'string') {
              return roleObj;
            } else if (roleObj && roleObj.authority) {
              return roleObj.authority;
            } else {
              return '';
            }
          }).filter(role => role); // Filtrar strings vacíos
        }
      }
      console.log("HOLAAAAAAAAAAAAAAA");
      const user: UserInterface = {
        id: claims.id || '', // ID si está disponible
        username: claims.username || '', // Asignar correctamente el nombre de usuario
        email: claims.sub || email,      // Asignar correctamente el correo electrónico
        admin: claims.isAdmin || false,
        trainer: claims.isTrainer || false,
        roles: rolesArray.map(role => ({ authority: role })),
        profileImageUrl: claims.profileImageUrl || '',
      };
      
      if (user.trainer) {
        console.log("AQUI EDELGARD entro al if user.trainer ",user);
        try {
          const trainerResponse = await apiClient.get(`/trainers/findByUserId/${user.id}`);
          console.log("aca deberia cambiarle el id",trainerResponse);
          const trainerData = trainerResponse.data;
          console.log("Trainer encontrado:", trainerData);
      
          // Reemplazar el id de usuario con el id del entrenador
          user.id = trainerData.id;
      
          // ACTUALIZA EL TRAINER ID EN REDUX
          dispatch(updateProfile({
            ...user,
            id: trainerData.id  // Reemplazamos el id con el del trainer
          }));
        } catch (error) {
          console.error("Error obteniendo trainerId:", error);
        }
      }
      

      console.log('AQUI ESTA EL USER:', user);

      dispatch(onLogin({
        user,
        roles: rolesArray,
        isAdmin: user.admin,
        trainer: user.trainer,
        token
      }));
  
      // Guardar en sessionStorage
      sessionStorage.setItem('login', JSON.stringify({
        isAuth: true,
        isAdmin: user.admin,
        trainer: user.trainer,
        user,
        roles: rolesArray,
      }));
      sessionStorage.setItem('token', `${token}`);
  

      // Redirigir al usuario según 'from' o su rol
      if (from) {
        navigate(from);
      } else if (user.admin) {
        console.log("Navegando a /admin/dashboard para admin");
        navigate('/admin/dashboard');
      } else if (user.trainer) {
        console.log("Navegando a /trainers para entrenador");
        navigate('/trainers');
      } else {
        console.log("Navegando a /dashboard para usuarios regulares");
        navigate('/dashboard');
      }
      

    } catch (error: unknown) {
      console.error("Error en el login:", error);
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        Swal.fire('Error de inicio de sesión', 'Correo o contraseña incorrectos', 'error');
      } else if (axiosError.response?.status === 403) {
        Swal.fire('Acceso denegado', 'No tiene permisos para acceder', 'error');
      } else {
        Swal.fire('Error inesperado', axiosError.message, 'error');
      }
    }
  };

  // Handler para el logout
  const handlerLogout = () => {
    dispatch(onLogout());
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('login');
    sessionStorage.clear();
    navigate('/auth/login');
  };

  return {
    login: {
      user,
      isAdmin,
      trainer,
      isAuth,
      roles,
      token,
    },
    handlerLogin,
    handlerLogout,
  };
}; 

export interface LoginCredentials {
    password: string;
    email: string;
}
