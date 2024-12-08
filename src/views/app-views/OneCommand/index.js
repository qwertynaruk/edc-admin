import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import Guarded from 'components/shared-components/Guarded';
import Loading from 'components/shared-components/Loading';
import RouterErrorElement from 'components/shared-components/RouterErrorElement';

const Home = lazy(() => import(`./Pages/Home`));
const MassNotification = lazy(() => import('./mass-notification'));
const CrimeIntelligence = lazy(() => import(`./Pages/CrimeIntelligence`));
const DashboardMeta = lazy(() => import(`./Pages/DashboardMeta`));
const POI = lazy(() => import(`./Pages/POI`));
const CMSPage = lazy(() => import('./Pages/cms'));

const OneCommand = () => {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Routes>
        <Route errorElement={<RouterErrorElement />} path="/" element={<Home />} />

        <Route
          errorElement={<RouterErrorElement />}
          path={'mass-notification/*'}
          element={
            <Guarded query={{ group: 'One Command', type: 'Mass Notification' }} onNoPermission={<Navigate to="/" />}>
              <MassNotification />
            </Guarded>
          }
        />
        <Route
          errorElement={<RouterErrorElement />}
          path={`crime-intelligence`}
          element={
            <Guarded query={{ group: 'One Command', type: 'Crime Intelligence' }} onNoPermission={<Navigate to="/" />}>
              <CrimeIntelligence />
            </Guarded>
          }
        />
        <Route
          errorElement={<RouterErrorElement />}
          path={`crime-intelligence/:name/:id`}
          element={
            <Guarded query={{ group: 'One Command', type: 'Crime Intelligence' }} onNoPermission={<Navigate to="/" />}>
              <DashboardMeta />
            </Guarded>
          }
        />

        <Route
          errorElement={<RouterErrorElement />}
          path={`gis`}
          element={
            <Guarded query={{ group: 'One Command', type: 'GIS Dashboard' }} onNoPermission={<Navigate to="/" />}>
              <POI />
            </Guarded>
          }
        />
        <Route
          errorElement={<RouterErrorElement />}
          path={`cms/*`}
          element={
            <Guarded
              query={{ group: 'One Command', type: 'Content Management System' }}
              onNoPermission={<Navigate to="/" />}
            >
              <CMSPage />
            </Guarded>
          }
        />

        <Route errorElement={<RouterErrorElement />} path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default OneCommand;
