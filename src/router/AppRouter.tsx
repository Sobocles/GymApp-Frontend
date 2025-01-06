import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Importamos el Layout unificado
import MainLayout from '../components/layout/MainLayout';

// Importar páginas públicas
import HomePage from '../pages/HomePage/HomePage';
import AboutUsPage from '../pages/AboutUsPage/AboutUsPage';
import ServicesPage from '../pages/ServicePage/ServicePage';
import { LoginPage } from '../Auth/pages'; 
import RegistrationPageRedirect from '../Auth/pages/Register/RegistrationPageRedirect';
import PaymentSuccessPage from '../Users/pages/mercadoPago/PaymentSuccessPage';
import PersonalTrainerPage from '../pages/personalTrainer/PersonalTrainer';
import StoreHomePage from '../Store/pages/StoreHomePage';
import ProteinaPage from '../Store/pages/ProteinaPage';
import CreatinaPage from '../Store/pages/CreatinaPage';
import ProductDetailPage from '../Store/pages/ProductDetailPage';
import CartPage from '../Store/pages/CartPage';

// Importar páginas protegidas
import { UserDashboard } from '../Users/pages/UserDashboard';
import DashboardAdmin from '../Admin/pages/AdminDashBoardPage';
import { UsersPage } from '../Admin/pages/userPage';
import TrainerDashboard from '../Trainers/pages/TrainerDashboard';
import CarouselAdminPage from '../Admin/pages/CarouselAdminPage';
import { TrainerProfileEditPage } from '../Trainers/pages/TrainerProfileEditPage';
import TrainerCalendarPage from '../Trainers/pages/TrainerCalendarPage';
import AssignTrainerAvailabilityPage from '../Admin/pages/AdminTrainerAvailabilityForm';
import AddMeasurementPage from '../Trainers/pages/AddMeasurementPage';
import AddRoutinePage from '../Trainers/pages/AddRoutinePage';
import MeasurementsPage from '../Users/pages/MeasurementsPage';
import { GroupClassesCreatePage } from '../Admin/pages/GroupClassesCreatePage';
import { GroupClassesAssignTrainerPage } from '../Admin/hooks/GroupClassesAssignTrainerPage';
import { AvailableClassesPage } from '../Users/pages/AvailableClassesPage';
import TrainerCalendar from '../components/Trainer-Calendar/TrainerCalendar';
import TrainerSessionsCalendar from '../Users/components/TrainerSessionsCalendar';
import { CategoryCrud } from '../Admin/pages/CategoryCrud';
import { ProductCrud } from '../Admin/pages/ProductCrud';

export const AppRouter = () => {
  const { isAuth } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {/**
       * Usamos un SOLO layout (MainLayout) para todas las rutas.
       * Dentro de él, hay rutas públicas y rutas que necesitan auth.
       */}
      <Route path="/" element={<MainLayout />}>
        
        {/** ========== RUTAS PÚBLICAS ========== */}
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutUsPage />} />
        <Route path="services" element={<ServicesPage />} />

        {/* Autenticación */}
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="auth/register" element={<RegistrationPageRedirect />} />

        {/* Éxito de pago (pública) */}
        <Route path="success" element={<PaymentSuccessPage />} />

        {/* Entrenadores (selector) */}
        <Route path="personal-trainer" element={<PersonalTrainerPage />} />

        {/* Tienda */}
        <Route path="store" element={<StoreHomePage />} />
        <Route path="store/page/:page" element={<StoreHomePage />} />
        <Route path="store/proteina" element={<ProteinaPage />} />
        <Route path="store/creatina" element={<CreatinaPage />} />
        <Route path="store/product/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />

        {/** ========== RUTAS PROTEGIDAS ========== */}

        {/* Dashboard de usuario */}
        <Route
          path="dashboard"
          element={isAuth ? <UserDashboard /> : <Navigate to="/auth/login" />}
        />
        
        {/* Dashboard admin */}
        <Route
          path="admin/dashboard"
          element={isAuth ? <DashboardAdmin /> : <Navigate to="/auth/login" />}
        />

<Route
  path="dashboard/trainer-sessions"
  element={isAuth ? <TrainerSessionsCalendar /> : <Navigate to="/auth/login" />}
/>

        <Route
  path="trainers/my-calendar"
  element={ isAuth ? <TrainerCalendarPage /> : <Navigate to="/auth/login" /> }
/>

        {/* Admin Users */}
        <Route
          path="admin/users"
          element={isAuth ? <UsersPage /> : <Navigate to="/auth/login" />}
        />
        <Route
          path="admin/users/page/:page"
          element={isAuth ? <UsersPage /> : <Navigate to="/auth/login" />}
        />

      <Route
        path="admin/store/categories"
        element={isAuth ? <CategoryCrud /> : <Navigate to="/auth/login" />}
      />
      <Route
        path="admin/store/products"
        element={isAuth ? <ProductCrud /> : <Navigate to="/auth/login" />}
      />

        {/* Trainer Dashboard */}
        <Route
          path="trainers"
          element={isAuth ? <TrainerDashboard /> : <Navigate to="/auth/login" />}
        />
        <Route
          path="trainers/edit-profile"
          element={isAuth ? <TrainerProfileEditPage /> : <Navigate to="/auth/login" />}
        />

        {/* Carousel admin */}
        <Route
          path="admin/carousel"
          element={isAuth ? <CarouselAdminPage /> : <Navigate to="/auth/login" />}
        />
        
        {/* Calendario Trainer */}
        <Route
          path="dashboard/calendar"
          element={isAuth ? <TrainerCalendar /> : <Navigate to="/auth/login" />}
        />
        
        {/* Disponibilidad Trainer (admin) */}
        <Route
          path="admin/trainer-availability"
          element={isAuth ? <AssignTrainerAvailabilityPage /> : <Navigate to="/auth/login" />}
        />

        {/* Medidas y Rutinas */}
        <Route
          path="trainers/clients/:clientId/measurements/add"
          element={isAuth ? <AddMeasurementPage /> : <Navigate to="/auth/login" />}
        />
        <Route
          path="trainers/clients/:clientId/routines/add"
          element={isAuth ? <AddRoutinePage /> : <Navigate to="/auth/login" />}
        />
        <Route
          path="users/measurements"
          element={isAuth ? <MeasurementsPage /> : <Navigate to="/auth/login" />}
        />

        {/* Clases grupales */}
        <Route
          path="admin/group-classes/create"
          element={isAuth ? <GroupClassesCreatePage /> : <Navigate to="/auth/login" />}
        />
        <Route
          path="admin/group-classes/assign-trainer"
          element={isAuth ? <GroupClassesAssignTrainerPage /> : <Navigate to="/auth/login" />}
        />
        <Route
          path="users/group-classes/available"
          element={isAuth ? <AvailableClassesPage /> : <Navigate to="/auth/login" />}
        />
 
      
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};
