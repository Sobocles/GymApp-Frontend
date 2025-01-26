// src/Admin/hooks/useUsers.ts

import { useDispatch, useSelector } from 'react-redux';
import { addUser, removeUser, updateUser, loadingUsers, onUserSelectedForm, onOpenForm, onCloseForm, loadingError, updatePaginator } from '../../Admin/store/users/usersSlice';
import { UserInterface } from '../../Auth/Interfaces/UserInterface';
import * as userService from '../../Admin/services/UserService';
import { useState } from 'react';
import apiClient from '../../Apis/apiConfig';

export const useUsers = () => {
  const dispatch = useDispatch();
  const { users, paginator, visibleForm, userSelected, errors, isLoading } = useSelector((state: any) => state.users);
  const [searchTerm, setSearchTerm] = useState('');

  const getUsers = async (page: number) => {
    try {
      const response = await userService.findAllPages(page, searchTerm);
      dispatch(loadingUsers(response.data.content));
      dispatch(updatePaginator({
        number: response.data.number,
        totalPages: response.data.totalPages,
        first: response.data.first,
        last: response.data.last,
      }));
    } catch (error) {
      console.error(error);
      dispatch(loadingError({ errorMessage: 'Error al cargar usuarios' }));
    }
  };

  const handlerOpenForm = () => {
    dispatch(onOpenForm());
  };

  const handlerCloseForm = () => {
    dispatch(onCloseForm());
  };

  const handlerUserSelectedForm = (user: UserInterface) => {
    dispatch(onUserSelectedForm(user));
  };

  const handlerAddUser = async (user: UserInterface) => {
    try {
      // Crear el usuario
      const response = await userService.save(user);
      const createdUser = response.data;
      console.log("usuario creado",createdUser)

      dispatch(addUser(createdUser));

      // Si el usuario es un trainer, asignar el rol de trainer y crear PersonalTrainer
      if (user.trainer) {
        console.log(user.trainer);
        const trainerData = {
          specialization: (user as any).specialization,
          experienceYears: (user as any).experienceYears,
          availability: (user as any).availability,
          monthlyFee: (user as any).monthlyFee,
          title: (user as any).title,
          studies: (user as any).studies,
          certifications: (user as any).certifications,
          description: (user as any).description,
          instagramUrl: (user as any).instagramUrl,      // <-- del root
          whatsappNumber: (user as any).whatsappNumber

        };
        console.log("trainerData",trainerData);
        const formData = new FormData();


        formData.append('specialization', trainerData.specialization);
        formData.append('experienceYears', String(trainerData.experienceYears));
        formData.append('availability', String(trainerData.availability));
        formData.append('monthlyFee', String(trainerData.monthlyFee));
        formData.append('title', trainerData.title);
        formData.append('studies', trainerData.studies);
        formData.append('certifications', trainerData.certifications);
        formData.append('description', trainerData.description);
        
        if (trainerData.instagramUrl) {
          formData.append('instagramUrl', trainerData.instagramUrl);
        }
        if (trainerData.whatsappNumber) {
          formData.append('whatsappNumber', trainerData.whatsappNumber);
        }
        
        // Y si hay un archivo
        if (user.certificationFile) {
          formData.append('certificationFile', user.certificationFile);
        }
  
        // Si se subió archivo, lo añadimos:
        if (user.certificationFile) {
          formData.append('certificationFile', user.certificationFile);
        }
  
        // Llamamos a /trainers/{createdUser.id}/assign
        const response = await apiClient.post(
          `/trainers/${createdUser.id}/assign`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        
        console.log(response);
      }

    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.data) {
        dispatch(loadingError({ errorMessage: error.response.data.message || 'Error al crear usuario' }));
      } else {
        dispatch(loadingError({ errorMessage: 'Error al crear usuario' }));
      }
    }
  };

  const handlerRemoveUser = async (id: string) => {
    try {
      await userService.remove(id);
      dispatch(removeUser(id));
    } catch (error) {
      console.error(error);
      dispatch(loadingError({ errorMessage: 'Error al eliminar usuario' }));
    }
  };

  return {
    users,
    visibleForm,
    handlerOpenForm,
    handlerCloseForm,
    handlerUserSelectedForm,
    handlerAddUser,
    handlerRemoveUser,
    paginator,
    searchTerm,
    setSearchTerm,
    getUsers,
    errors,
    isLoading,
  };
};
