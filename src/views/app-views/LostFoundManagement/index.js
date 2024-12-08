import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import Loading from 'components/shared-components/Loading';
import RouterErrorElement from 'components/shared-components/RouterErrorElement';

const LostFoundPage = lazy(() => import(`./LostFoundPage`));
const LostFoundCreatePage = lazy(() => import(`./CreatePage`));
const LostFoundDetailPage = lazy(() => import(`./DetailPage`));
const LostFoundReportPage = lazy(() => import(`./LostReportPage`));
const LostFoundClainPage = lazy(() => import(`./ClaimPage`));
const LostFoundRefundPage = lazy(() => import(`./RefundPage`));

export default function LostFoundManagement() {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Routes>
        <Route errorElement={<RouterErrorElement />} path={`/`} element={<LostFoundPage />} />
        <Route errorElement={<RouterErrorElement />} path={`/create`} element={<LostFoundCreatePage />} />
        <Route errorElement={<RouterErrorElement />} path={`/:id`} element={<LostFoundDetailPage />} />
        <Route errorElement={<RouterErrorElement />} path={`/lost-report`} element={<LostFoundReportPage />} />
        <Route errorElement={<RouterErrorElement />} path={`/claim`} element={<LostFoundClainPage />} />
        <Route errorElement={<RouterErrorElement />} path={`/refund`} element={<LostFoundRefundPage />} />
        <Route errorElement={<RouterErrorElement />} path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
