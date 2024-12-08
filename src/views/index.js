import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from 'configs/AppConfig';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import AppLayout from 'layouts/app-layout';
import AuthLayout from 'layouts/auth-layout';
import Guarded from 'components/shared-components/Guarded';
import Loading from 'components/shared-components/Loading';
import { NotificationContainer } from 'react-notifications';
import { Organization } from './auth-views/components/SelectOrg';
import RouterErrorElement from 'components/shared-components/RouterErrorElement';
import UserStore from 'mobx/UserStore';
import VisualizationLayout from 'layouts/visualization-layout';
import _ from 'lodash';
import { observer } from 'mobx-react';

const Launchpad = lazy(() => import('./app-views/launchpad'));
const Personnel = lazy(() => import('./app-views/personnel'));
const Setting = lazy(() => import('./app-views/SettingGlobals'));
const SettingProfile = lazy(() => import('./app-views/SettingProfile'));
const Notification = lazy(() => import('./app-views/Notification'));
const OneCommand = lazy(() => import('./app-views/OneCommand'));
const IncidentManagement = lazy(() => import('./app-views/incident-management'));
const ForgetPassword = lazy(() => import(`./auth-views/authentication/forgetpassword`));
const Login = lazy(() => import(`./auth-views/authentication/login`));
const Login2FA = lazy(() => import(`./auth-views/authentication/login-2fa`));
const AlarmMonitoringRoute = lazy(() => import(`./app-views/AlamMonitoring`));
const LostFoundManagement = lazy(() => import('./app-views/LostFoundManagement'));

export const Views = (props) => {
  const location = useLocation();

  const { access_token = null } = UserStore.accessAuthen;

  const isAuthenticated = access_token !== null;

  const { selectBranch, isGlobal } = UserStore;

  const getRedirectRoute = () => {
    let pathRedirect = '/auth/login';
    const redirect = location.pathname;

    if (isAuthenticated) {
      if (_.isEmpty(selectBranch?.chooseBranch)) {
        if (isGlobal) {
          pathRedirect = '/auth/organization';
        } else {
          pathRedirect = '/auth/login';
        }
        return pathRedirect;
        // return {
        //   pathname: pathRedirect,
        //   search: createSearchParams({
        //     redirect,
        //   }).toString(),
        // };
      } else {
        return '/app/launchpad';
      }
    }

    if (_.isEmpty(selectBranch?.chooseBranch)) {
      if (isGlobal) {
        pathRedirect = '/auth/organization';
      }
    }
    // if (redirect.startsWith('/app')) {
    //   return {
    //     pathname: pathRedirect,
    //     search: createSearchParams({
    //       redirect,
    //     }).toString(),
    //   };
    // } else {
    return pathRedirect;
    // }
  };

  const toRedirect = () => {
    // skip auth check refresh token
    console.log('isAuthenticated', isAuthenticated);
    if (!isAuthenticated || _.isEmpty(selectBranch?.chooseBranch)) {
      const to = getRedirectRoute();
      return <Navigate to={to} replace />;
    }
    return <AppLayout {...props} />;
  };

  const screenPermission = () => {
    if (!isAuthenticated) {
      return <Navigate to="/app/launchpad" replace />;
    }
    return <VisualizationLayout {...props} />;
  };

  return (
    <>
      <Suspense fallback={<Loading cover="content" />}>
        <Routes>
          <Route errorElement={<RouterErrorElement />} path={`${AUTH_PREFIX_PATH}/*`} element={<AuthLayout />}>
            <Route errorElement={<RouterErrorElement />} path={`login`} element={<Login />} />
            <Route errorElement={<RouterErrorElement />} path={`organization`} element={<Organization />} />
            <Route errorElement={<RouterErrorElement />} path={`login-2fa`} element={<Login2FA />} />
            <Route errorElement={<RouterErrorElement />} path={`forget-password`} element={<ForgetPassword />} />
            <Route errorElement={<RouterErrorElement />} path="*" element={<Navigate to="login" replace />} />
          </Route>

          <Route errorElement={<RouterErrorElement />} path={`${APP_PREFIX_PATH}/*`} element={toRedirect()}>
            <Route errorElement={<RouterErrorElement />} path="launchpad" element={<Launchpad />} />

            <Route
              path="incident-management/*"
              element={
                <Guarded
                  // query={{ group: canUpdate ? 'queue_management' : 'incident_management' }}
                  query={{ group: 'Incident Management' }}
                  onNoPermission={<Navigate to={getRedirectRoute()} />}
                >
                  <IncidentManagement />
                </Guarded>
              }
            />

            <Route
              path="personnel/*"
              element={
                <Guarded query={{ group: 'Personnel' }} onNoPermission={<Navigate to={getRedirectRoute()} />}>
                  <Personnel />
                </Guarded>
              }
            />

            <Route
              path="setting/*"
              element={
                <Guarded
                  query={{ group: 'System Administration' }}
                  onNoPermission={<Navigate to={getRedirectRoute()} />}
                >
                  <Setting />
                </Guarded>
              }
            />

            <Route errorElement={<RouterErrorElement />} path="setting-profile/*" element={<SettingProfile />} />

            <Route errorElement={<RouterErrorElement />} path="notification" element={<Notification />} />

            <Route
              path="one-command/*"
              element={
                <Guarded query={{ group: 'One Command' }} onNoPermission={<Navigate to={getRedirectRoute()} />}>
                  <OneCommand />
                </Guarded>
              }
            />

            <Route
              path="alarm-monitoring/*"
              element={
                <Guarded query={{ group: 'Alarm Monitoring' }} onNoPermission={<Navigate to={getRedirectRoute()} />}>
                  <AlarmMonitoringRoute />
                </Guarded>
              }
            />

            <Route path="lost-found-management/*" element={<LostFoundManagement />} />

            <Route errorElement={<RouterErrorElement />} path="*" element={<Navigate to="launchpad" replace />} />
          </Route>

          <Route errorElement={<RouterErrorElement />} path="/*" element={<Navigate to={APP_PREFIX_PATH} replace />} />
        </Routes>
      </Suspense>
      <NotificationContainer />
    </>
  );
};

export default observer(Views);
