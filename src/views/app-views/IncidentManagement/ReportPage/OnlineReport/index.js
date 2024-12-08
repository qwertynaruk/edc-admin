import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';
import RouterErrorElement from 'components/shared-components/RouterErrorElement';

const Home = lazy(() => import(`./Home`));
const Detail = lazy(() => import(`./Detail`));
const NoPermission = lazy(() => import('../NoPermission'));

const OnlineReport = () => {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Routes>
        <Route errorElement={<RouterErrorElement />} path={`/`} element={<Home />} />
        <Route errorElement={<RouterErrorElement />} path={`detail/:id`} element={<Detail />} />
        <Route errorElement={<RouterErrorElement />} path={`no-permission`} element={<NoPermission />} />
      </Routes>
    </Suspense>
  );
};

export default OnlineReport;
