import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import { RolesList } from 'features/role-management/components/roles-list';
import { observer } from 'mobx-react';

const Role = () => {
  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'ตั้งค่า', subpath: 'สิทธิ์การใช้งาน' }} />
      <RolesList />
    </>
  );
};

export default observer(Role);
