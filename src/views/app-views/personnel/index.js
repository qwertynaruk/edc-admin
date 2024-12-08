import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import Loading from 'components/shared-components/Loading';
import RouterErrorElement from 'components/shared-components/RouterErrorElement';

const PersonnelListPage = lazy(() => import('./personnel-list-page'));
const PersonnelCreatePage = lazy(() => import('./personnel-create-page'));
const PersonnelUpdatePage = lazy(() => import('./personnel-update-page'));
const Setting = lazy(() => import('./setting'));

const Personnel = () => {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Routes>
        <Route errorElement={<RouterErrorElement />} path="/" element={<PersonnelListPage />} />
        <Route errorElement={<RouterErrorElement />} path="/create" element={<PersonnelCreatePage />} />
        <Route errorElement={<RouterErrorElement />} path="/:id" element={<PersonnelUpdatePage />} />
        <Route errorElement={<RouterErrorElement />} path="/setting/*" element={<Setting />} />
        <Route errorElement={<RouterErrorElement />} path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default Personnel;
