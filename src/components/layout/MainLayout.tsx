// src/components/layout/MainLayout.tsx

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

import Header from './Header/Header';
import Footer from './Footer/Footer';
import Sidebar from './SideBar/SideBar';
import { PROTECTED_PATHS } from '../../config/protectedPaths';
import Carousel from '../common/Carousel';

const MainLayout = () => {
  console.log('MainLayout montado');
  const { isAuth, user } = useSelector((state: RootState) => state.auth);

  // Detectar la ruta actual
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  // Roles del usuario
  const userRoles = user?.roles?.map((r) =>
    typeof r === 'string' ? r : r.authority
  ) || [];

  // Verificamos si es una ruta protegida (para mostrar u ocultar sidebar)
  const isProtectedRoute = PROTECTED_PATHS.some((protectedPath) =>
    currentPath.startsWith(protectedPath.toLowerCase())
  );

  const canSeeSidebar = isAuth && isProtectedRoute && (
    userRoles.includes('ROLE_ADMIN') ||
    userRoles.includes('ROLE_TRAINER') ||
    userRoles.includes('ROLE_USER')
  );

  // Nuevo: Verificamos si la ruta es la Home ("/")
  const isHomePage = currentPath === '/';

  return (
    <>
      <Header />

      {/* Mostramos el carrusel solo si es la página de inicio */}
      {isHomePage && <Carousel />}

      <div style={{ display: 'flex', minHeight: '80vh' }}>
        {canSeeSidebar && <Sidebar />}

        <div style={{ flex: 1, padding: '1rem' }}>
          <Outlet />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MainLayout;
