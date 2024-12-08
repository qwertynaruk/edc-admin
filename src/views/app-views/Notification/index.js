import Loading from 'components/shared-components/Loading';
import RouterErrorElement from 'components/shared-components/RouterErrorElement';
import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Notification = lazy(() => import(`./Pages/List`));

const PersonnelRoute = (props) => {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Routes>
        <Route errorElement={<RouterErrorElement />} path={`/`} element={<Notification />} />
      </Routes>
    </Suspense>
  );
};

export default PersonnelRoute;
