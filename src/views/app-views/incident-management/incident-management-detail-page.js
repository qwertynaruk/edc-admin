import { Col, Row } from 'antd';
import {
  IncidentManagementComment,
  IncidentManagementEventsDetail,
  IncidentManagementForward,
  IncidentManagementHistory,
  IncidentManagementProcess,
  useGetIncidentManagement,
} from 'features/incident-management';

import { FallbackError } from 'components/util-components/fallback-error';
import Loading from 'components/shared-components/Loading';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import { useParams } from 'react-router-dom';

const IncidentManagementDetailPage = () => {
  const { id } = useParams();

  const stashGetIncidentManagement = useGetIncidentManagement(id);
  const { data, isLoading, isError } = stashGetIncidentManagement;

  if (isError) {
    return <FallbackError />;
  }

  if (isLoading) {
    return <Loading cover="content" />;
  }

  return (
    <>
      <PageBreadcrumb
        pageLabel={{
          master: 'Incident Management',
          subpath: 'รายงานจากเว็บฟอร์ม',
        }}
      />
      <Row>
        <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
          <IncidentManagementEventsDetail incidentDetail={data} />
          <IncidentManagementComment {...stashGetIncidentManagement} incidentId={id} />
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
          <IncidentManagementProcess {...stashGetIncidentManagement} incidentId={id} />
          <IncidentManagementForward incidentId={id} data={data} />
          <IncidentManagementHistory incidentId={id} />
        </Col>
      </Row>
    </>
  );
};

export default IncidentManagementDetailPage;
