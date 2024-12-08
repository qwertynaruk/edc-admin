import { Button, Card, Checkbox, Space, Typography } from 'antd';

import AreaOfResponsibilityTable from '../../Component/AreaOfResponsibilityTable';
import AreaPolygonPage from './AreaPolygon/index';
// import AreaPolygonPage from './AreaPolygon/indexBk2';
import CardTab from 'components/shared-components/CardTab';
import Guarded from 'components/shared-components/Guarded';
import LabelShowText from 'components/shared-components/LabelShowText';
import LabsContentEmpty from 'components/layout-components/LabsContentEmpty';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import UserStore from 'mobx/UserStore';
import _ from 'lodash';
import styled from '@emotion/styled';
import useGISZoneAgent from 'hooks/services/useGISZoneAgent';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const { Title, Text } = Typography;

const SidePanel = styled(Card)`
  position: absolute !important;
  z-index: 10;
  top: 0;
  left: 0;
  width: 300px;
  border: none !important;
  border-right: 1px solid #000 !important;
  .ant-card-body {
    padding: 16px;
    height: 100%;
  }
`;

const Flex1Container = styled(Space)`
  width: auto !important;
  margin-left: -16px;
  margin-right: -16px;
  .ant-space-item {
    flex: 1;
  }
`;

const frameHeight = 600;

const SidePanelContent = (props) => {
  const { onChange, selectedZone, selectedZones, searchTerm, zoneAgents, tabs, onMenuTextClick } = props;
  const filtered = zoneAgents
    ?.filter((item) => item.is_delete === !tabs)
    .filter((item) => {
      if (searchTerm.length === 0) {
        return true;
      }
      return item.name.includes(searchTerm);
    });

  if (!filtered) return null;
  if (filtered.length === 0) {
    return (
      <LabsContentEmpty className="gx-my-4">
        <Space direction="vertical">
          <>กรุณาเพิ่มข้อมูล</>
          <>พื้นที่</>
        </Space>
      </LabsContentEmpty>
    );
  }
  return (
    <Checkbox.Group
      style={{
        width: '100%',
        height: 'calc(100% - 175px)',
        overflow: 'scroll',
      }}
      onChange={onChange}
      value={selectedZones}
    >
      <Space direction="vertical">
        {filtered.map((item) => (
          <Space key={item._id}>
            <Checkbox value={item._id} />
            <Text
              onClick={onMenuTextClick?.(item._id)}
              style={{ cursor: 'pointer', color: selectedZone === item._id ? '#FF3744' : '' }}
            >
              {item.name}
            </Text>
          </Space>
        ))}
      </Space>
    </Checkbox.Group>
  );
};

const ZoneAgentCard = (props) => {
  const navigate = useNavigate();
  const { data: zoneAgent, loading } = useGISZoneAgent(
    props.id && {
      params: {
        zone_agent_id: props.id,
      },
    }
  );
  if (!props.id) {
    return (
      <Card>
        <LabsContentEmpty>
          <Space direction="vertical">เลือกพื้นที่</Space>
        </LabsContentEmpty>
      </Card>
    );
  }
  return (
    <Card loading={loading}>
      <Space className="gx-justify-content-between">
        <Title level={5}>
          พื้นที่รับผิดชอบ {_.get(zoneAgent, 'name', '-')}: {_.get(zoneAgent, 'police_station_name', '-')}
        </Title>
        <Guarded
          query={{
            group: 'System Administration',
            type: 'พื้นที่รับผิดชอบ',
            action: 'update',
          }}
        >
          <Button type="primary" onClick={() => navigate(zoneAgent._id)}>
            ตั้งค่าพื้นที่รับผิดชอบ
          </Button>
        </Guarded>
      </Space>
      <LabelShowText labelText="จำนวนประชากรในพื้นที่" value={zoneAgent?.people_count} />
      <AreaOfResponsibilityTable agents={_.get(zoneAgent, 'agents', [])} />
    </Card>
  );
};

const AreaOfResponsibility = () => {
  const [searchText, setSearchText] = useState('');
  const [keyTab, setKeyTab] = useState(null);
  const { organization } = UserStore;
  // console.log('organization',organization?._id);

  const onSearch = (value) => {
    setSearchText(value);
  };

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'ตั้งค่า', subpath: '' }} />
      <CardTab
        isCustom
        onActiveTabKey={(value) => {
          setKeyTab(value);
        }}
        tabList={[
          // {
          //   key: 'arealist',
          //   tab: 'รายการพื้นที่รับผิดชอบ',
          //   children: (
          //     <>
          //       <Input.Search placeholder="ค้นหา" onSearch={onSearch} allowClear />
          //     </>
          //   ),
          // },
          {
            key: 'area',
            tab: 'แผนที่แสดงพื้นที่รับผิดชอบ',
            children: (
              <>
                <AreaPolygonPage organizationID={organization?._id} view={true} />
              </>
            ),
          },
        ]}
      />
      {/* {(keyTab === 'arealist' || !keyTab) && <AreaList />} */}
    </>
  );
};

export default AreaOfResponsibility;
