import Loading from 'components/shared-components/Loading';
import RouterErrorElement from 'components/shared-components/RouterErrorElement';
import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Detail = lazy(() => import(`./Detail`));
const History = lazy(() => import(`./History`));
const Edit = lazy(() => import(`./Edit`));

const IdRouter = () => {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Routes>
        <Route errorElement={<RouterErrorElement />} index path={`/`} element={<Detail />} />
        <Route errorElement={<RouterErrorElement />} path={`history`} element={<History />} />
        <Route errorElement={<RouterErrorElement />} path={'edit'} element={<Edit />} />
      </Routes>
    </Suspense>
  );
};

export default IdRouter;
