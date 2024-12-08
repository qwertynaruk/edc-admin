import RedirectGates, { PathProviders } from 'components/shared-components/RedirectGates';
import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import Loading from 'components/shared-components/Loading';
import RouterErrorElement from 'components/shared-components/RouterErrorElement';
import _ from 'lodash';

const OnlineReport = lazy(() => import(`./ReportPage/OnlineReport`));
const FinallyReport = lazy(() => import(`./ReportPage/FinallyReport`));

const ImportPage = lazy(() => import(`./ImportPage`));

export const pathNames = {
  online: {
    url: 'report/online',
    query: {
      group: 'Incident Management',
      type: 'รายงานแจ้งความออนไลน์',
    },
  },
};

const IncidentManagement = () => {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Routes>
        <Route
          errorElement={<RouterErrorElement />}
          path={pathNames.online.url + '/*'}
          element={
            <PathProviders query={pathNames.online.query}>
              <OnlineReport />
            </PathProviders>
          }
        />

        <Route errorElement={<RouterErrorElement />} path={`import-report`} element={<ImportPage />} />
        <Route errorElement={<RouterErrorElement />} path={`finally/*`} element={<FinallyReport />} />
        <Route path="*" element={<RedirectGates routeQueries={_.values(pathNames)} />} />
      </Routes>
    </Suspense>
  );
};

export default IncidentManagement;
