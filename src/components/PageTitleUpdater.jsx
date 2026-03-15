import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const routeTitles = {
  '/user/login': 'Login | EMS',
  '/dashboard': 'Dashboard | EMS',
  '/emails': 'Email Logs | EMS',
  '/emails/compose': 'Compose Email | EMS',
  '/templates': 'Templates | EMS',
  '/contacts': 'Contacts | EMS',
  '/change-password': 'Change Password | EMS',
  '/upload-template': 'Upload Template | EMS',
  '/register-user': 'Register User | EMS',
  '/manage-users': 'Manage Users | EMS',
};

const PageTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const title = routeTitles[location.pathname] || 'EMS';
    document.title = title;
  }, [location.pathname]);

  return null;
};

export default PageTitleUpdater;
