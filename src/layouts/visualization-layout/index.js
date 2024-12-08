import { Outlet, useNavigate } from 'react-router-dom';
import { Image, Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';

const VisualizationLayout = () => {
  const navigate = useNavigate();

  return (
    <Layout className="gx-app-layout">
      <Layout>
        <Content className="gx-layout-content gx-container-wrap">
          <div className="gx-main-content-wrapper">
            <div
              style={{ position: 'fixed', zIndex: 9, top: 15, left: 15, cursor: 'pointer' }}
              onClick={() => navigate('/app/master-indices')}
            >
              <Image width={200} preview={false} src="/img/new-logo-dark.png" />
            </div>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default VisualizationLayout;
