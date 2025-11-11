import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from '../../features/dashboard/pages/DashboardPage';
import RequisitionFormPage from '../../features/requisitions/pages/RequisitionFormPage';
import LoginPage from '../../features/auth/pages/LoginPage';
import RequisitionSuccessPage from '../../features/requisitions/pages/RequisitionSuccessPage';
import RequisitionsListPage from '../../features/requisitions/pages/RequisitionsListPage';

function RequireAuth({ children }: { children: JSX.Element }) {
  const authed = typeof localStorage !== 'undefined' && localStorage.getItem('auth') === '1';
  return authed ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
      <Route path="/requisitions" element={<RequireAuth><RequisitionsListPage /></RequireAuth>} />
      <Route path="/requisitions/new" element={<RequireAuth><RequisitionFormPage /></RequireAuth>} />
      <Route path="/requisitions/success" element={<RequireAuth><RequisitionSuccessPage /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
