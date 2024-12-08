import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';
import RouterErrorElement from 'components/shared-components/RouterErrorElement';

const Home = lazy(() => import(`./Home`));

const FinallyReportRouter = () => {
  console.log('hi');
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Routes>
        <Route errorElement={<RouterErrorElement />} path={`/:id`} element={<Home />} />
      </Routes>
    </Suspense>
  );
};

export default FinallyReportRouter;
