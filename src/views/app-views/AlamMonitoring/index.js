import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';
import RouterErrorElement from 'components/shared-components/RouterErrorElement';
import { Global, css } from '@emotion/react';
const AlarmMonitoringPage = lazy(() => import(`./Pages/AlarmMonitorings`));
const AlarmMonitoringListPage = lazy(() => import(`./Pages/AlarmMonitoringList`));
const DetailAlarmPage = lazy(() => import(`./Pages/DetailAlarm`));
const customNotificationStyles = css`
  .ant-notification {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: #545454;
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.3;
    list-style: none;
    font-feature-settings: 'tnum';
    position: fixed;
    z-index: 10;
    margin-right: 24px;
  }
`;
const AlarmMonitoringRoute = () => {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Routes>
        <Route errorElement={<RouterErrorElement />} index path="/list" element={<AlarmMonitoringListPage />} />
      </Routes>

      <Routes>
        <Route errorElement={<RouterErrorElement />} index path="/detail/:id" element={<DetailAlarmPage />} />
      </Routes>
      <Routes>
        <Route
          errorElement={<RouterErrorElement />}
          index
          path="/"
          element={
            <>
              <Global styles={customNotificationStyles} />
              <AlarmMonitoringPage />
            </>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AlarmMonitoringRoute;
