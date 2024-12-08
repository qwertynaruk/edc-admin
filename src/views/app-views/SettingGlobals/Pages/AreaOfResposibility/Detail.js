import { Button, Card, Radio, Space, Typography } from 'antd';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import LabelShowText from 'components/shared-components/LabelShowText';
import useGISZone from 'hooks/services/useGISZone';
import useGISZoneAgent from 'hooks/services/useGISZoneAgent';
import _ from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';
import AreaOfResponsibilityTable from '../../Component/AreaOfResponsibilityTable';

const { Title } = Typography;

const AreaOfResponsibilityDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: zoneAgent = {} } = useGISZoneAgent({
    params: {
      zone_agent_id: id,
    },
  });
  const { data: zone, loading } = useGISZone(
    () =>
      zoneAgent?.gis_zone_id && {
        params: {
          zone_id: zoneAgent.gis_zone_id,
        },
      }
  );

  const onEditClick = () => {
    navigate('edit');
  };

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'ตั้งค่า', subpath: 'พื้นที่และผู้รับผิดชอบ' }}>
        <Space>
          {/* <Button ghost>ประวัติ</Button> */}
          <Button ghost onClick={onEditClick}>
            แก้ไขข้อมูล
          </Button>
        </Space>
      </PageBreadcrumb>
      <Card title={'ตั้งค่าพื้นที่รับผิดชอบ'} loading={loading}>
        <Title level={5}>ข้อมูลพื้นที่</Title>
        <Radio.Group value={zoneAgent.is_delete} disabled className="gx-my-3">
          <Radio value={false}>ใช้งาน</Radio>
          <Radio value={true}>ไม่ใช้งาน</Radio>
        </Radio.Group>
        <LabelShowText labelText="พื้นที่ข้อมูลสารสนเทศภูมิศาสตร์" value={_.get(zone, 'name', '-')} />
        <LabelShowText labelText="ชื่อพื้นที่" value={_.get(zoneAgent, 'name', '-')} />
        <Space>
          <LabelShowText labelText="จำนวนประชากรในพื้นที่" value={zoneAgent?.people_count} />
          <LabelShowText labelText="สถานีตำรวจที่รับผิดชอบ" value={_.get(zoneAgent, 'police_station_name', '-')} />
        </Space>
      </Card>
      <Card loading={loading}>
        <Title level={5}>รายชื่อผู้รับผิดชอบในพื้นที่</Title>
        <AreaOfResponsibilityTable edit disabled agents={zoneAgent.agents} />
      </Card>
    </>
  );
};

export default AreaOfResponsibilityDetail;
