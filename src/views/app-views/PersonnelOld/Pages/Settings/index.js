import Loading from 'components/shared-components/Loading';
import RouterErrorElement from 'components/shared-components/RouterErrorElement';
import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const Position = lazy(() => import(`./Position`));
const Department = lazy(() => import(`./Department`));
const Organization = lazy(() => import(`./Organization`));

export default function SettingPosition() {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Routes>
        <Route errorElement={<RouterErrorElement />} path={`position`} element={<Position />} />
        <Route errorElement={<RouterErrorElement />} path={`department`} element={<Department />} />
        <Route errorElement={<RouterErrorElement />} path={`organization`} element={<Organization />} />
        <Route path="*" element={<Navigate to="position" replace />} />
      </Routes>
    </Suspense>
  );
}
