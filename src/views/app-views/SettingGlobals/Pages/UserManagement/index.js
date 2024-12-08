import { observer } from 'mobx-react';
import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';
import RouterErrorElement from 'components/shared-components/RouterErrorElement';

const Officer = lazy(() => import('./Officer'));
const OfficerDetail = lazy(() => import('./Officer/Detail'));
const People = lazy(() => import('./People'));
const PeopleDetail = lazy(() => import('./People/Detail'));

const UserManagement = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route errorElement={<RouterErrorElement />} path="officer" element={<Officer />} />
        <Route errorElement={<RouterErrorElement />} path="officer/:id" element={<OfficerDetail />} />
        <Route errorElement={<RouterErrorElement />} path="people" element={<People />} />
        <Route errorElement={<RouterErrorElement />} path="people/:id" element={<PeopleDetail />} />
        <Route errorElement={<RouterErrorElement />} path="*" element={<Navigate to="officer" replace />} />
      </Routes>
    </Suspense>
  );
};
export default observer(UserManagement);
