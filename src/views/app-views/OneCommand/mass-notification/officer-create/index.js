import { Col, Row } from 'antd';
import { MassNotificationOfficerBoundary, MassNotificationOfficerCommunication } from 'features/mass-notification';

import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';

const OfficerCreatePage = () => {
  return (
    <>
      <PageBreadcrumb
        pageLabel={{
          master: 'Mass Notification',
          subpath: 'เพิ่มข้อความแจ้งเตือน',
        }}
      />
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
          <MassNotificationOfficerCommunication />
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
          <MassNotificationOfficerBoundary />
        </Col>
      </Row>
    </>
  );
};

export default OfficerCreatePage;
