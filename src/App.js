import 'moment/locale/th';
import 'assets/vendors/style';
import './index.scss';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ConfigProvider } from 'antd';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { THEME_CONFIG } from 'configs/AppConfig';
import Views from './views';
import { queryClient } from 'lib/react-query';
import styled from '@emotion/styled';
import thTH from 'antd/lib/locale/th_TH';
import { useEffect } from 'react';

const router = createBrowserRouter([
  {
    path: '*',
    element: <Views />,
  },
]);

function App() {
  const { innerWidth } = window;

  useEffect(() => {
    if (THEME_CONFIG.currentTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else if (document.body.classList.contains('dark-theme')) {
      document.body.classList.remove('dark-theme');
    }
  }, []);

  return (
    <AppChangeBackGroundTheme className="App" innerWidth={innerWidth}>
      <ConfigProvider locale={thTH}>
        <QueryClientProvider client={queryClient}>
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ConfigProvider>
    </AppChangeBackGroundTheme>
  );
}

export default App;

const AppChangeBackGroundTheme = styled.div`
  ${({ innerWidth }) => `
  height:100%;
  background-size:${innerWidth > 1600 ? 'contain' : 'cover'};
  &::before {
    position: absolute;
    bottom: 50px;
    right: 25px;

    }
  `}
`;
