import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import Loading from 'components/shared-components/Loading';

export const Department = lazy(() => import('./department'));
export const Position = lazy(() => import('./position'));

const Setting = () => {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Routes>
        <Route path="/department" element={<Department />} />
        <Route path="/position" element={<Position />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default Setting;
