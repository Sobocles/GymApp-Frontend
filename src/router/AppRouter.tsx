// src/AppRouter.tsx

import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Importar páginas públicas
import HomePage from '../pages/HomePage/HomePage';
import AboutUsPage from '../pages/AboutUsPage/AboutUsPage';
import ServicesPage from '../pages/ServicePage/ServicePage';

// Importar páginas protegidas
import { UsersPage } from '../Admin/pages/userPage';
import TrainerDashboard from '../Trainers/pages/TrainerDashboard';
import CarouselAdminPage from '../Admin/pages/CarouselAdminPage';
import { UserDashboard } from '../Users/pages/UserDashboard'; // Importa el UserDashboard

import PublicLayout from '../components/layout/PublicLayout';
import LoginPageRedirect from '../Auth/pages/Login/LoginPageRedirect';
import RegistrationPageRedirect from '../Auth/pages/Register/RegistrationPageRedirect';
import ProtectedLayout from '../components/layout/ProtectedLayout';
import { TrainerProfileEditPage } from '../Trainers/pages/TrainerProfileEditPage';
import { LoginPage } from '../Auth/pages';
import PaymentSuccessPage from '../Users/pages/mercadoPago/PaymentSuccessPage';

export const AppRouter = () => {
  const { isAuth } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutUsPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="auth/register" element={<RegistrationPageRedirect />} />
        <Route path="/success" element={<PaymentSuccessPage />} />

      </Route>

      {/* Rutas Protegidas */}
      {isAuth && (
        <Route path="/" element={<ProtectedLayout />}>
          <Route path="dashboard" element={<UserDashboard />} /> {/* Ruta para el dashboard del usuario */}
          <Route path="admin/users" element={<UsersPage />} />
          <Route path="admin/users/page/:page" element={<UsersPage />} />
          <Route path="trainers" element={<TrainerDashboard />} />
          <Route path="trainers/edit-profile" element={<TrainerProfileEditPage />} />
          <Route path="admin/carousel" element={<CarouselAdminPage />} />
          

        </Route>
      )}

      {/* Redireccionar rutas no coincidentes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
