import RedirectGates, { PathProviders } from 'components/shared-components/RedirectGates';
import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import Loading from 'components/shared-components/Loading';
import RouterErrorElement from 'components/shared-components/RouterErrorElement';
import _ from 'lodash';

const Home = lazy(() => import(`./Pages/Home`));
const Create = lazy(() => import(`./Pages/Create`));
const Edit = lazy(() => import(`./Pages/Edit`));
const Schedule = lazy(() => import(`./Pages/Schedule`));
const Settings = lazy(() => import(`./Pages/Settings`));
const ImportReportForce = lazy(() => import(`./Pages/ImportReportForce`));
const TeamManagement = lazy(() => import(`./Pages/TeamManagement`));
const Approval = lazy(() => import(`./Pages/Approval`));
const OrganizeChart = lazy(() => import(`./Pages/OrganizeChart`));

const pathNames = {
  personnels: {
    url: 'list',
    query: {
      group: 'Personnel',
      type: 'กำลังพล',
    },
  },
  schedules: {
    url: 'schedule',
    query: {
      group: 'Personnel',
      type: 'ตารางปฏิบัติหน้าที่',
    },
  },
  teams: {
    url: 'team',
    query: {
      group: 'Personnel',
      type: 'ชุดปฏิบัติการ',
    },
  },
};

const PersonnelRoute = () => {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Routes>
        <Route
          errorElement={<RouterErrorElement />}
          path={pathNames.personnels.url}
          element={
            <PathProviders query={pathNames.personnels.query}>
              <Home />
            </PathProviders>
          }
        />

        <Route
          errorElement={<RouterErrorElement />}
          path={`:id/edit`}
          element={
            <PathProviders query={pathNames.personnels.query}>
              <Edit />
            </PathProviders>
          }
        />

        <Route
          errorElement={<RouterErrorElement />}
          path={`create`}
          element={
            <PathProviders query={pathNames.personnels.query}>
              <Create />
            </PathProviders>
          }
        />

        <Route
          errorElement={<RouterErrorElement />}
          path={`import-report-force`}
          element={
            <PathProviders query={pathNames.personnels.query}>
              <ImportReportForce />
            </PathProviders>
          }
        />

        <Route
          errorElement={<RouterErrorElement />}
          path={`${pathNames.teams.url}/*`}
          element={
            <PathProviders query={pathNames.teams.query}>
              <TeamManagement />
            </PathProviders>
          }
        />

        <Route errorElement={<RouterErrorElement />} path={`organize-chart`} element={<OrganizeChart />} />
        <Route errorElement={<RouterErrorElement />} path={'schedule/*'} element={<Schedule />} />
        <Route errorElement={<RouterErrorElement />} path={'settings/*'} element={<Settings />} />
        <Route errorElement={<RouterErrorElement />} path={`approval`} element={<Approval />} />

        <Route path="*" element={<RedirectGates routeQueries={_.values(pathNames)} />} />
      </Routes>
    </Suspense>
  );
};

export default PersonnelRoute;
