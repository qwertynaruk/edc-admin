import Loading from 'components/shared-components/Loading';
import RouterErrorElement from 'components/shared-components/RouterErrorElement';
import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Home = lazy(() => import(`./Home`));
const Agency = lazy(() => import(`./Agency`));
const IdRouter = lazy(() => import(`./[id]`));
const Person = lazy(() => import(`./Person`));

const ScheduleRouter = () => {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Routes>
        <Route errorElement={<RouterErrorElement />} index path={`/`} element={<Home />} />
        <Route errorElement={<RouterErrorElement />} path="agency/*" element={<Agency />} />
        <Route errorElement={<RouterErrorElement />} path="person/*" element={<Person />} />
        <Route errorElement={<RouterErrorElement />} path=":id/*" element={<IdRouter />} />
      </Routes>
    </Suspense>
  );
};

export default ScheduleRouter;
