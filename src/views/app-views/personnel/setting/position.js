import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import { PersonnelPosition } from 'features/personnel';

const PositionPage = () => {
  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'กำลังพล', subpath: 'ตำแหน่ง' }} />
      <PersonnelPosition />
    </>
  );
};

export default PositionPage;
