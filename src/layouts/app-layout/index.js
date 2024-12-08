import { Outlet, useLocation } from 'react-router-dom';

import Footer from 'components/layout-components/Footer';
import InsideHeader from 'components/layout-components/InsideHeader';
import { Layout } from 'antd';
import Loading from 'components/shared-components/Loading';
import LogoBackground from 'components/logo-components/logoBackground';
import { useEffect } from 'react';
import useUser from 'hooks/services/useUser';

const { Content } = Layout;

export const AppLayout = (props) => {
  const location = useLocation();
  const { loading } = useUser();

  useEffect(() => {
    // CoreStore.CheckRefreshToken();
  }, []);

  return (
    <Layout className="gx-app-layout">
      <Layout>
        <InsideHeader {...props} />
        <Content className="gx-layout-content gx-container-wrap">
          <div className="gx-main-content-wrapper">
            <div className="gx-body-wrapper">
              {loading && <Loading />}
              {!loading && <Outlet />}
              {!loading && props.children}
            </div>
          </div>
        </Content>
        <LogoBackground />
        {location.pathname.includes('app/launchpad') && <Footer />}
      </Layout>
    </Layout>
  );
};

export default AppLayout;
