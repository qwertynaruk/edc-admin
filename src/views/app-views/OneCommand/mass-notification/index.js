import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import Loading from 'components/shared-components/Loading';
import RouterErrorElement from 'components/shared-components/RouterErrorElement';

const Home = lazy(() => import('./home'));
const CitizenCreate = lazy(() => import('./citizen-create'));
const CitizenTest = lazy(() => import('./citizen-test'));
const CitizenDetail = lazy(() => import('./citizen-create'));
const OfficerCreate = lazy(() => import('./officer-create'));
const OfficerDetail = lazy(() => import('./officer-detail'));
const Setting = lazy(() => import('./setting'));

const MassNotification = () => {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Routes>
        <Route errorElement={<RouterErrorElement />} path="/" element={<Home />} />
        <Route errorElement={<RouterErrorElement />} path="/citizen/create" element={<CitizenCreate />} />
        <Route errorElement={<RouterErrorElement />} path="/citizen/test" element={<CitizenTest />} />
        <Route errorElement={<RouterErrorElement />} path="/citizen/:id" element={<CitizenDetail />} />
        <Route errorElement={<RouterErrorElement />} path="/officer/create" element={<OfficerCreate />} />
        <Route errorElement={<RouterErrorElement />} path="/officer/:id" element={<OfficerDetail />} />
        <Route errorElement={<RouterErrorElement />} path="/setting" element={<Setting />} />
        <Route errorElement={<RouterErrorElement />} path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default MassNotification;
