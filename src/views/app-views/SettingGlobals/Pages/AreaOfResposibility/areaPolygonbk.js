import { Button, Card, Checkbox, Col, Input, Row, Space, Typography } from 'antd';
import { useMemo, useState } from 'react';

import AddGIS from '../../Component/Modal/AddGIS';
import AreaOfResponsibilityTable from '../../Component/AreaOfResponsibilityTable';
import Guarded from 'components/shared-components/Guarded';
import LabelShowText from 'components/shared-components/LabelShowText';
import LabsContentEmpty from 'components/layout-components/LabsContentEmpty';
import MapFrame from 'views/app-views/OneCommand/Components/MapFrame';
import { SearchOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { currentLocation } from 'constants/MapConstant';
import produce from 'immer';
import styled from '@emotion/styled';
import useGISZoneAgent from 'hooks/services/useGISZoneAgent';
import useGISZoneAgents from 'hooks/services/useGISZoneAgents';
import { useNavigate } from 'react-router-dom';

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

const AreaPolygon = () => {
  const [state, setState] = useState({
    modalVisible: false,
    tabs: true,
    selectedZones: [],
    gisData: [],
    selectedZone: null,
    searchTerm: '',
  });
  const { data: zoneAgents, loading, mutate } = useGISZoneAgents({});

  const filteredZones = useMemo(() => {
    if (!zoneAgents) return [];
    return zoneAgents
      .filter((zone) => state.selectedZones.includes(zone._id))
      .map((item) => {
        return produce(item, (draft) => {
          if (!draft.zone.gis_datas) return;
          draft.zone.gis_datas = draft.zone.gis_datas.map((gis) => {
            return {
              ...gis,
              onClick: () => {
                onMenuTextClick(item._id)();
              },
            };
          });
        });
      });
  }, [state.selectedZones, zoneAgents]);

  const openAddGisModal = () => {
    setState(
      produce((draft) => {
        draft.modalVisible = true;
      })
    );
  };
  const setModalVisible = (visible) => {
    setState(
      produce((draft) => {
        draft.modalVisible = visible;
      })
    );
  };
  const setTabsActive = () => {
    setState(
      produce((draft) => {
        draft.tabs = true;
      })
    );
  };
  const setTabsInactive = () => {
    setState(
      produce((draft) => {
        draft.tabs = false;
      })
    );
  };

  const onCheckboxChange = (selectedZones) => {
    setState(
      produce((draft) => {
        draft.selectedZones = selectedZones;
      })
    );
  };

  const onMenuTextClick = (id) => {
    return () => {
      setState(
        produce((draft) => {
          draft.selectedZone = id;
        })
      );
    };
  };

  const onSeachTermChange = (e) => {
    setState(
      produce((draft) => {
        draft.searchTerm = e.target.value;
      })
    );
  };
  return (
    <>
      <Card bodyStyle={{ padding: 0 }}>
        {/* <Spin spinning={loading}> */}
        <SidePanel className="gx-m-0" style={{ height: frameHeight }}>
          <Space direction="vertical" size={16}>
            <Space className="gx-justify-content-between">
              <Title level={5}>ข้อมูลพื้นที่</Title>
              <Guarded
                query={{
                  group: 'System Administration',
                  type: 'พื้นที่รับผิดชอบ',
                  action: 'update',
                }}
              >
                <Button type="primary" onClick={openAddGisModal}>
                  เพิ่ม
                </Button>
              </Guarded>
            </Space>
            <Input
              prefix={<SearchOutlined className="gx-mr-2" />}
              placeholder="ค้นหา...."
              onChange={onSeachTermChange}
            />
          </Space>
          <Guarded
            query={{
              group: 'System Administration',
              type: 'พื้นที่รับผิดชอบ',
              action: 'update',
            }}
          >
            <Row className="gx-mt-4" gutter={[8, 8]}>
              <Col span={12}>
                <Button
                  {...{ type: state.tabs ? 'primary' : 'default' }}
                  className="gx-full-width"
                  onClick={setTabsActive}
                >
                  ใช้งาน
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  {...{ type: !state.tabs ? 'primary' : 'default' }}
                  className="gx-full-width"
                  onClick={setTabsInactive}
                >
                  ไม่ใช้งาน
                </Button>
              </Col>
            </Row>
          </Guarded>
          <div className="gx-mt-4"></div>
          <SidePanelContent
            onMenuTextClick={onMenuTextClick}
            onChange={onCheckboxChange}
            selectedZones={state.selectedZones}
            selectedZone={state.selectedZone}
            searchTerm={state.searchTerm}
            zoneAgents={zoneAgents}
            tabs={state.tabs}
          />
        </SidePanel>
        <MapFrame currentLocation={currentLocation} frameHeight={frameHeight} zoneAgent={filteredZones} />
        {/* </Spin> */}
      </Card>
      <ZoneAgentCard id={state.selectedZone} />
      <AddGIS visible={state.modalVisible} setVisible={setModalVisible} mutate={mutate} />
    </>
  );
};

export default AreaPolygon;
