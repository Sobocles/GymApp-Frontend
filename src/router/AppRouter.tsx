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
import RegistrationPageRedirect from '../Auth/pages/Register/RegistrationPageRedirect';
import ProtectedLayout from '../components/layout/ProtectedLayout';
import { TrainerProfileEditPage } from '../Trainers/pages/TrainerProfileEditPage';
import { LoginPage } from '../Auth/pages';
import PaymentSuccessPage from '../Users/pages/mercadoPago/PaymentSuccessPage';
import PersonalTrainerPage from '../pages/personalTrainer/PersonalTrainer';
import TrainerCalendarPage from '../Users/pages/TrainerCalendarPage';
import AssignTrainerAvailabilityPage from '../Admin/pages/AdminTrainerAvailabilityForm';
import AddMeasurementPage from '../Trainers/pages/AddMeasurementPage';
import AddRoutinePage from '../Trainers/pages/AddRoutinePage';
import MeasurementsPage from '../Users/pages/MeasurementsPage';
import { GroupClassesCreatePage } from '../Admin/pages/GroupClassesCreatePage';
import { GroupClassesAssignTrainerPage } from '../Admin/hooks/GroupClassesAssignTrainerPage';
import { AvailableClassesPage } from '../Users/pages/AvailableClassesPage';
import DashboardAdmin from '../Admin/pages/AdminDashBoardPage';
import StoreHomePage from '../Store/pages/StoreHomePage';
import ProteinaPage from '../Store/pages/ProteinaPage';
import CreatinaPage from '../Store/pages/CreatinaPage';
import ProductDetailPage from '../Store/pages/ProductDetailPage';
import CartPage from '../Store/pages/CartPage';


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
        <Route path="personal-trainer" element={<PersonalTrainerPage />} />

        <Route path="store" element={<StoreHomePage />} />
        <Route path="store/page/:page" element={<StoreHomePage />} />
        
          <Route path="store/proteina" element={<ProteinaPage />} />
          <Route path="store/creatina" element={<CreatinaPage />} />
          <Route path="store/product/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} /> 
      </Route>

      {/* Rutas Protegidas */}
      {isAuth && (
        <Route path="/" element={<ProtectedLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="admin/dashboard" element={<DashboardAdmin />} />
          <Route path="admin/users" element={<UsersPage />} />
          <Route path="admin/users/page/:page" element={<UsersPage />} />
          <Route path="trainers" element={<TrainerDashboard />} />
          <Route path="trainers/edit-profile" element={<TrainerProfileEditPage />} />
          <Route path="admin/carousel" element={<CarouselAdminPage />} />
          <Route path="dashboard/calendar" element={<TrainerCalendarPage />} />
          <Route path="admin/trainer-availability" element={<AssignTrainerAvailabilityPage />} />
          <Route path="trainers/clients/:clientId/measurements/add" element={<AddMeasurementPage />} />
        <Route path="trainers/clients/:clientId/routines/add" element={<AddRoutinePage />} />
        <Route path="users/measurements" element={<MeasurementsPage />} />
        <Route path="admin/group-classes/create" element={<GroupClassesCreatePage />} />
        <Route path="admin/group-classes/assign-trainer" element={<GroupClassesAssignTrainerPage />} />
        <Route path="users/group-classes/available" element={<AvailableClassesPage />} />
        
     
        </Route>
      )}

      {/* Redireccionar rutas no coincidentes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
