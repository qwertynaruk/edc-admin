import { Outlet } from 'react-router-dom';
import Footer from 'components/layout-components/Footer';
import { NotificationContainer } from 'react-notifications';

export const AuthLayout = () => {
  return (
    <div className="gx-justify-container gx-app-login-wrap">
      <div className="gx-main-content-wrapper">
        <Outlet />
      </div>
      <Footer />
      <NotificationContainer />
    </div>
  );
};

export default AuthLayout;
