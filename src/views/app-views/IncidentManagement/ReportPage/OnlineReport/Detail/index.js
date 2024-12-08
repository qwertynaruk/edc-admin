import { Col, Row } from 'antd';

import { IncidenceReportOnlineDetail } from './components/incidence-report-online-detail';
import { IncidentReportOnlineComment } from './components/incident-report-online-comment';
import { IncidentReportOnlineHistory } from './components/incident-report-online-history';
import { IncidentReportOnlineProcess } from './components/incident-report-online-process';
import { IncidentReportOnlineSubmitWork } from './components/incident-report-online-submit-work';

const IncidentManagementOnlineReportPage = () => {
  return (
    <>
      <Row>
        <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
          <IncidenceReportOnlineDetail />
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
          <IncidentReportOnlineProcess />
          <IncidentReportOnlineSubmitWork />
          <IncidentReportOnlineHistory />
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <IncidentReportOnlineComment />
        </Col>
      </Row>
    </>
  );
};

export default IncidentManagementOnlineReportPage;
