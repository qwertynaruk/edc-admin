import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import Loading from 'components/shared-components/Loading';
import RouterErrorElement from 'components/shared-components/RouterErrorElement';

const CmsListPage = lazy(() => import('./cms-list-page'));
const CmsCreatePage = lazy(() => import('./cms-create-page'));
const CmsUpdatePage = lazy(() => import('./cms-update-page'));

const CMSPage = () => {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Routes>
        <Route errorElement={<RouterErrorElement />} path="/" element={<CmsListPage />} />
        <Route errorElement={<RouterErrorElement />} path="create" element={<CmsCreatePage />} />
        <Route errorElement={<RouterErrorElement />} path="update/:id" element={<CmsUpdatePage />} />
        <Route errorElement={<RouterErrorElement />} path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default CMSPage;
