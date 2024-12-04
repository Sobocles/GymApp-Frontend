// src/config/menuItems.ts

import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export interface MenuItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
}

export const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: DashboardIcon,
    roles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_TRAINER'],
  },
  {
    label: 'Usuarios',
    path: '/admin/users',
    icon: PeopleIcon,
    roles: ['ROLE_ADMIN'],
  },
  {
    label: 'Entrenadores',
    path: '/trainers',
    icon: AssignmentIndIcon,
    roles: ['ROLE_TRAINER'],
  },
  {
    label: 'Administrador de Carrusel',
    path: '/admin/carousel',
    icon: PhotoLibraryIcon,
    roles: ['ROLE_ADMIN'],
  },
  {
    label: 'Editar Perfil',
    path: '/trainers/edit-profile',
    icon: AccountCircleIcon,
    roles: ['ROLE_TRAINER'],
  },
  // Puedes agregar más ítems para usuarios normales si lo deseas
];
