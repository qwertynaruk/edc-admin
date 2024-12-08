import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import { PersonnelDepartment } from 'features/personnel';

const department = () => {
  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'กำลังพล', subpath: 'ฝ่ายงาน' }} />
      <PersonnelDepartment />
    </>
  );
};

export default department;
