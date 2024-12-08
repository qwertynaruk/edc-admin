import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import Loading from 'components/shared-components/Loading';
import RouterErrorElement from 'components/shared-components/RouterErrorElement';

const IncidentManagementListPage = lazy(() => import('./incident-management-list-page'));
const IncidentManagementDetailPage = lazy(() => import('./incident-management-detail-page'));
const IncidentManagementForwardedPage = lazy(() => import('./incident-management-forwarded-page'));

const IncidentManagement = () => {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Routes>
        <Route errorElement={<RouterErrorElement />} path="/" element={<IncidentManagementListPage />} />
        <Route errorElement={<RouterErrorElement />} path=":id" element={<IncidentManagementDetailPage />} />
        <Route
          errorElement={<RouterErrorElement />}
          path=":id/forwarded"
          element={<IncidentManagementForwardedPage />}
        />
        <Route errorElement={<RouterErrorElement />} path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default IncidentManagement;
