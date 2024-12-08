import { Col, Row } from 'antd';
import {
  IncidentManagementEventsDetail,
  IncidentManagementForwardedReport,
  useGetIncidentForwardManagement,
} from 'features/incident-management';

import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

const IncidentManagementForwardedPage = () => {
  const { id } = useParams();

  const { data } = useGetIncidentForwardManagement(id);

  const mapNewData = useMemo(() => {
    return {
      created_at: data?.created_at,
      reason: data?.reason,
      created_by: data?.created_by,
      transfer_from_org: data?.transfer_from_org,
      transfer_to_org: data?.transfer_to_org,
      reporter: data?.audited_logs?.reporter,
      report_detail: data?.audited_logs?.report_detail,
      report_location: data?.audited_logs?.report_location,
      report_attachments: data?.audited_logs?.report_attachments,
    };
  }, [data]);

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
          <IncidentManagementEventsDetail incidentDetail={mapNewData} />
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
          <IncidentManagementForwardedReport incidentDetail={mapNewData} />
        </Col>
      </Row>
    </>
  );
};

export default IncidentManagementForwardedPage;
