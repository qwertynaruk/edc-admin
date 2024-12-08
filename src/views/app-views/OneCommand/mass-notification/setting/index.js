import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import Loading from 'components/shared-components/Loading';
import RouterErrorElement from 'components/shared-components/RouterErrorElement';

const NotificationTypeSetting = lazy(() => import('./notification-type'));

const NotificationSetting = () => {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Routes>
        <Route errorElement={<RouterErrorElement />} path="*" element={<NotificationTypeSetting />} />
      </Routes>
    </Suspense>
  );
};

export default NotificationSetting;
