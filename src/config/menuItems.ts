// src/config/menuItems.ts

import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; 
import EventIcon from '@mui/icons-material/Event';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import MeasurementsIcon from '@mui/icons-material/FitnessCenter';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


export interface MenuItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
  subItems?: {
    label: string;
    path: string;
    roles: string[];
  }[];
}


export const menuItems: MenuItem[] = [

  {
    label: 'Dashboard Admin',
    path: '/admin/dashboard',
    icon: DashboardIcon,
    roles: ['ROLE_ADMIN']
  },
  {
    label: 'Dashboard User',
    path: '/dashboard',
    icon: DashboardIcon,
    roles: ['ROLE_USER'],
  },
  {
    label: 'Sesiones Personal Trainer',
    path: '/dashboard/trainer-sessions',
    icon: CalendarTodayIcon,
    roles: ['ROLE_USER'],
  },
  
  {
    label: 'Usuarios',
    path: '/admin/users',
    icon: PeopleIcon,
    roles: ['ROLE_ADMIN'],
  },
  {
    label: 'Dashboard Trainer',
    path: '/trainers',
    icon: DashboardIcon,
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
    roles: ['ROLE_TRAINER','ROLE_USER'],
  },
  {
    label: 'Gestión de Productos',
    path: '/admin/store/products',
    icon: ShoppingCartIcon,
    roles: ['ROLE_ADMIN'],
  },
  {
    label: 'Gestión de Categorías',
    path: '/admin/store/categories',
    icon: ShoppingCartIcon,
    roles: ['ROLE_ADMIN'],
  },

  {
    label: 'Calendario',
    path: '/dashboard/calendar',
    icon: CalendarTodayIcon,
    roles: ['ROLE_USER'],
  },
  {
    label: 'Asignar Disponibilidad',
    path: '/admin/trainer-availability',
    icon: EventIcon,
    roles: ['ROLE_ADMIN'],
  },
  {
    label: 'Agregar Medición',
    path: '/trainers/clients/1/measurements/add',
    icon: MedicalInformationIcon,
    roles: ['ROLE_TRAINER'], 
  },
  {
    label: 'Agregar Rutina',
    path: '/trainers/clients/1/routines/add',
    icon: FitnessCenterIcon,
    roles: ['ROLE_TRAINER'],
  },
  {
    label: 'Mediciones',
    path: '/users/measurements', 
    icon: MeasurementsIcon,
    roles: ['ROLE_USER'],
  },
  {
    label: 'Clases Grupales',
    path: '/admin/group-classes/create',
    icon: FitnessCenterIcon, // el icono que prefieras
    roles: ['ROLE_ADMIN'],
  },
  {
    label: 'Asignar Entrenador a Clase',
    path: '/admin/group-classes/assign-trainer',
    icon: AssignmentIndIcon,
    roles: ['ROLE_ADMIN'],
  },
  {
    label: 'Clases Disponibles',
    path: '/users/group-classes/available',
    icon: FitnessCenterIcon,
    roles: ['ROLE_USER'],
  },

  {
    label: 'Mi Calendario (Trainer)',
    path: '/trainers/my-calendar',
    icon: CalendarTodayIcon,
    roles: ['ROLE_TRAINER'],
  },
  
  
  {
    label: 'Tienda',
    path: '/store',
    icon: ShoppingCartIcon,
    roles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_TRAINER'],
    subItems: [
      {
        label: 'Proteína',
        path: '/store/proteina',
        roles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_TRAINER'],
      },
      {
        label: 'Creatina',
        path: '/store/creatina',
        roles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_TRAINER'],
      },
    ],
  },
  
];
