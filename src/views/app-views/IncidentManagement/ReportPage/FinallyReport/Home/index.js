import { useEffect, useState } from 'react';
import _ from 'lodash';
import { observer } from 'mobx-react';
import { Card, Col, Row, Space, Typography } from 'antd';
import { useParams } from 'react-router-dom';

import ReportStore from 'mobx/ReportStore';
import ReportCustomPrint from 'views/app-views/IncidentManagement/Components/ReportCustomPrint';

import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import PersonnelSelectWidget from 'components/shared-components/PersonnelSelectWidget';
import UserStore from 'mobx/UserStore';

const { Text, Paragraph, Title } = Typography;

const Home = () => {
  const { id } = useParams();
  const { typesList = [], reportItems = {} } = ReportStore;
  const [loading, setLoading] = useState(false);
  console.log(useParams());
  useEffect(() => {
    setLoading(true);

    ReportStore.getReportItems(id).finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'รายงาน', subpath: ['รายงานประจำวัน', 'ปิดรายงาน'] }} />
      <div className="gx-main-content">
        <Row gutter={16}>
          <Col span={24}>
            <Card loading={loading}>
              <Title level={5}>
                ปิด
                {_.get(
                  _.find(typesList, (e) => e._id === _.get(reportItems, 'report_type_id', '-')),
                  'name',
                  'รายงานประจำวันรับแจ้งเอกสารหาย'
                )}
              </Title>
              <Space className="gx-mt-4 gx-mb-1" size={25}>
                <Paragraph>
                  <Text className="gx-mr-2 gx-text-level-0">หมายเลขรายงาน :</Text>
                  <Text>{_.get(reportItems, 'report_record_id', '-')}</Text>
                </Paragraph>

                <Paragraph>
                  <Text className="gx-mr-2 gx-text-level-0">ผู้รับผิดชอบ :</Text>
                  <PersonnelSelectWidget
                    viewMode={{ enable: true, values: _.get(reportItems, 'report_responsible_id', '') }}
                  />
                </Paragraph>
                <Paragraph>
                  <Text className="gx-mr-2 gx-text-level-0">เจ้าของรายงาน :</Text>
                  <PersonnelSelectWidget
                    viewMode={{
                      enable: true,
                      values: _.get(reportItems, 'report_owner_id', _.get(UserStore, 'user.personnel_id', '')),
                    }}
                  />
                </Paragraph>
              </Space>

              <Space size={25}>
                <Paragraph>
                  <Text className="gx-mr-2 gx-text-level-0">เล่มที่ :</Text>
                  <Text>-</Text>
                </Paragraph>

                <Paragraph>
                  <Text className="gx-mr-2 gx-text-level-0">เลขที่ :</Text>
                  <Text>-</Text>
                </Paragraph>

                <Paragraph>
                  <Text className="gx-mr-2 gx-text-level-0">ข้อที่ :</Text>
                  <Text>-</Text>
                </Paragraph>

                <Paragraph>
                  <Text className="gx-mr-2 gx-text-level-0">วัน เดือน ปี เวลา :</Text>
                  <Text>-</Text>
                </Paragraph>
              </Space>
            </Card>
          </Col>
        </Row>

        <ReportCustomPrint
          reportTypeName={`ปิด${_.get(
            _.find(typesList, (e) => e._id === _.get(reportItems, 'report_type_id', '-')),
            'name',
            'รายงานประจำวันรับแจ้งเอกสารหาย'
          )}`}
        />
      </div>
    </>
  );
};

export default observer(Home);
