import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import Guarded from 'components/shared-components/Guarded';
import Loading from 'components/shared-components/Loading';
import RouterErrorElement from 'components/shared-components/RouterErrorElement';

const MenuPanel = lazy(() => import(`./Pages/MenuPanel`));
const Attribute = lazy(() => import(`./Pages/Attribute`));
const User = lazy(() => import(`./Pages/UserManagement`));
const Role = lazy(() => import(`./Pages/Role`));
const RoleCreate = lazy(() => import(`./Pages/Role/Create`));
const RoleEdit = lazy(() => import(`./Pages/Role/Edit`));
const Organization = lazy(() => import(`./Pages/Organization`));
const OrganizationCreate = lazy(() => import(`./Pages/Organization/Create`));
const OrganizationEdit = lazy(() => import(`./Pages/Organization/Edit`));
const Histroy = lazy(() => import(`./Pages/History`));
const AreaOfResponsibility = lazy(() => import(`./Pages/AreaOfResposibility`));
const AreaOfResponsibilityDetail = lazy(() => import(`./Pages/AreaOfResposibility/Detail`));
const AreaOfResponsibilityEdit = lazy(() => import(`./Pages/AreaOfResposibility/Edit`));
const GIS = lazy(() => import(`./Pages/GIS`));

const SettingGlobalsRoute = () => {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Routes>
        <Route
          errorElement={<RouterErrorElement />}
          path={`/attribute`}
          element={
            <Guarded
              query={{ group: 'System Administration', type: 'คุณลักษณะ' }}
              onNoPermission={<Navigate to="/app/setting" />}
            >
              <Attribute />
            </Guarded>
          }
        />

        <Route
          errorElement={<RouterErrorElement />}
          path={`/user/*`}
          element={
            <Guarded
              query={{ group: 'System Administration', type: 'ผู้ใช้งาน' }}
              onNoPermission={<Navigate to="/app/setting" />}
            >
              <User />
            </Guarded>
          }
        />

        <Route
          errorElement={<RouterErrorElement />}
          path={`/role`}
          element={
            <Guarded
              query={{ group: 'System Administration', type: 'สิทธิ์การใช้งาน' }}
              onNoPermission={<Navigate to="/app/setting" />}
            >
              <Role />
            </Guarded>
          }
        />

        <Route
          errorElement={<RouterErrorElement />}
          path={`/role/create`}
          element={
            <Guarded
              query={{ group: 'System Administration', type: 'สิทธิ์การใช้งาน', action: 'create' }}
              onNoPermission={<Navigate to="/app/setting" />}
            >
              <RoleCreate />
            </Guarded>
          }
        />

        <Route
          errorElement={<RouterErrorElement />}
          path={`/role/:id`}
          element={
            <Guarded
              query={{ group: 'System Administration', type: 'สิทธิ์การใช้งาน', action: 'read' }}
              onNoPermission={<Navigate to="/app/setting" />}
            >
              <RoleEdit />
            </Guarded>
          }
        />

        <Route
          errorElement={<RouterErrorElement />}
          path={`/organization`}
          element={
            <Guarded
              query={{ group: 'System Administration', type: 'ตัวจัดการองค์กร' }}
              onNoPermission={<Navigate to="/app/setting" />}
            >
              <Organization />
            </Guarded>
          }
        />
        <Route
          errorElement={<RouterErrorElement />}
          path={`/organization/create`}
          element={
            <Guarded
              query={{ group: 'System Administration', type: 'ตัวจัดการองค์กร', action: 'create' }}
              onNoPermission={<Navigate to="/app/setting" />}
            >
              <OrganizationCreate />
            </Guarded>
          }
        />
        <Route
          errorElement={<RouterErrorElement />}
          path={`/organization/edit`}
          element={
            <Guarded
              query={{ group: 'System Administration', type: 'ตัวจัดการองค์กร', action: 'update' }}
              onNoPermission={<Navigate to="/app/setting" />}
            >
              <OrganizationEdit />
            </Guarded>
          }
        />
        <Route
          errorElement={<RouterErrorElement />}
          path={`/organization/edit/:id`}
          element={
            <Guarded
              query={{ group: 'System Administration', type: 'ตัวจัดการองค์กร', action: 'update' }}
              onNoPermission={<Navigate to="/app/setting" />}
            >
              <OrganizationEdit />
            </Guarded>
          }
        />

        <Route
          errorElement={<RouterErrorElement />}
          path={`/area-of-responsibility`}
          element={
            <Guarded
              query={{
                group: 'System Administration',
                type: 'พื้นที่รับผิดชอบ',
              }}
              onNoPermission={<Navigate to="/app/setting" />}
            >
              <AreaOfResponsibility />
            </Guarded>
          }
        />

        <Route
          errorElement={<RouterErrorElement />}
          path={`/area-of-responsibility/:id`}
          element={
            <Guarded
              query={{
                group: 'System Administration',
                type: 'พื้นที่และผู้รับผิดชอบ',
                name: 'ดูข้อมูลพื้นที่และผู้รับผิดชอบ',
              }}
              onNoPermission={<Navigate to="/app/setting" />}
            >
              <AreaOfResponsibilityDetail />
            </Guarded>
          }
        />

        <Route
          errorElement={<RouterErrorElement />}
          path={`/area-of-responsibility/:id/edit`}
          element={
            <Guarded
              query={{
                group: 'System Administration',
                type: 'พื้นที่และผู้รับผิดชอบ',
                name: 'แก้ไขพื้นที่และผู้รับผิดชอบ',
              }}
              onNoPermission={<Navigate to="/app/setting" />}
            >
              <AreaOfResponsibilityEdit />
            </Guarded>
          }
        />

        <Route
          errorElement={<RouterErrorElement />}
          path={`/gis`}
          element={
            <Guarded
              query={{ group: 'System Administration', type: 'ข้อมูลสารสนเทศภูมิศาสตร์' }}
              onNoPermission={<Navigate to="/app/setting" />}
            >
              <GIS />
            </Guarded>
          }
        />

        <Route
          errorElement={<RouterErrorElement />}
          path={`/history`}
          element={
            <Guarded
              query={{ group: 'System Administration', type: 'ประวัติการเข้าใช้งานในระบบ' }}
              onNoPermission={<Navigate to="/app/setting" />}
            >
              <Histroy />
            </Guarded>
          }
        />

        <Route errorElement={<RouterErrorElement />} index path="/" element={<MenuPanel />} />
      </Routes>
    </Suspense>
  );
};

export default SettingGlobalsRoute;
