import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import EmailLogs from '../pages/EmailLogs';
import EmailSender from '../pages/EmailSender';
import Templates from '../pages/Templates';
import Contacts from '../pages/Contacts';
import UploadTemplate from '../pages/UploadTemplate';
import RegisterUser from '../pages/RegisterUser';
import ManageUsers from '../pages/ManageUsers';
import ChangePassword from '../pages/ChangePassword';
import AdminRoute from './AdminRoute';
import AdminManagerRoute from './AdminManagerRoute';
import PageTitleUpdater from '../components/PageTitleUpdater';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <PageTitleUpdater />
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/user/login" element={<Login />} />

          {/* Protected — wrapped in dashboard layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/emails" element={<EmailLogs />} />
              <Route path="/emails/compose" element={<EmailSender />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/change-password" element={<ChangePassword />} />

              {/* Admin & Manager Routes */}
              <Route element={<AdminManagerRoute />}>
                <Route path="/upload-template" element={<UploadTemplate />} />
              </Route>

              {/* Admin Only Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/register-user" element={<RegisterUser />} />
                <Route path="/manage-users" element={<ManageUsers />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/user/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
