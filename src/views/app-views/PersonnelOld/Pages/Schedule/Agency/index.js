import Loading from 'components/shared-components/Loading';
import RouterErrorElement from 'components/shared-components/RouterErrorElement';
import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Create = lazy(() => import(`./Create`));
const AgencyRouter = () => {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Routes>
        <Route errorElement={<RouterErrorElement />} path="create" element={<Create />} />
      </Routes>
    </Suspense>
  );
};

export default AgencyRouter;
