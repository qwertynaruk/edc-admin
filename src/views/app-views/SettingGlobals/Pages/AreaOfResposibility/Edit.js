import { Button, Card, Col, Divider, Form, Input, Radio, Row, Space, Spin, Typography } from 'antd';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import DialogNotification from 'components/shared-components/DialogNotification';
import GISZoneSelectWidget from 'components/shared-components/GISZoneSelectWidget';
import MasterSelectWidget from 'components/shared-components/MasterSelectWidget';
import PersonnelTransfer from 'components/shared-components/Modal/PersonnelTransfer';
import useGISZoneAgent from 'hooks/services/useGISZoneAgent';
import produce from 'immer';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GISService from 'services/GISService';
import AreaOfResponsibilityTable from '../../Component/AreaOfResponsibilityTable';

const { Title } = Typography;

const AreaOfResponsibilityEdit = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { data: zoneAgent = {}, loading } = useGISZoneAgent({
    params: {
      zone_agent_id: id,
    },
  });
  const [state, setState] = useState({
    personnelModalVisible: false,
    actionLoading: false,
  });

  const setVisible = (visible) => {
    setState(
      produce((draft) => {
        draft.personnelModalVisible = visible;
      })
    );
  };

  const onTransferPersonnelSubmit = (newAgents) => {
    // const oldAgents = form.getFieldValue('agents') || [];
    console.log(newAgents);
    form.setFieldsValue({
      agents: _.uniqBy(newAgents, '_id'),
    });
  };

  const onTableCheckboxChange = (agents) => {
    form.setFieldsValue({
      agents,
    });
  };

  const onBackClick = () => {
    navigate(-1);
  };

  const onFinish = (values) => {
    setState(
      produce((draft) => {
        draft.actionLoading = true;
      })
    );
    const agents = values.agents.map((item) => {
      return {
        agent_id: item._id,
        agent_type: item.agent_type,
        is_notify: item.is_notify,
        notify_channel_types: ['udc_mobile_app'],
      };
    });
    GISService.updateZoneAgent({
      params: {
        zone_agent_id: id,
      },
      data: {
        data: {
          ...zoneAgent,
          ...values,
          agents,
        },
      },
    })
      .then(() => {
        DialogNotification('success', 'แก้ไขข้อมูลสำเร็จ');
      })
      .catch(() => {
        DialogNotification('error', 'แก้ไขข้อมูลสำเร็จ');
      })
      .finally(() => {
        setState(
          produce((draft) => {
            draft.actionLoading = false;
          })
        );
      });
  };

  useEffect(() => {
    if (!zoneAgent) return;
    form.setFieldsValue(zoneAgent);
  }, [form, zoneAgent]);

  return (
    <Spin spinning={loading}>
      <PageBreadcrumb pageLabel={{ master: 'ตั้งค่า', subpath: 'พื้นที่และผู้รับผิดชอบ' }} />
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Card title="ตั้งค่าพื้นที่รับผิดชอบ">
          <Title level={5}>ข้อมูลพื้นที่</Title>
          <Form.Item name="is_delete" label="พื้นที่">
            <Radio.Group className="gx-my-3">
              <Radio value={false}>ใช้งาน</Radio>
              <Radio value={true}>ไม่ใช้งาน</Radio>
            </Radio.Group>
          </Form.Item>
          <Row className="gx-flex-row" gutter={16}>
            <Col span={8}>
              <Form.Item label="พื้นที่ข้อมูลสารสนเทศภูมิศาสตร์" name="gis_zone_id">
                <GISZoneSelectWidget disabled={true} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="ชื่อพื้นที่" name="name">
                <Input placeholder="กรอกชื่อพื้นที่รับผิดชอบ" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="สถานีตำรวจที่รับผิดชอบ" name="police_station_name">
                <MasterSelectWidget placeholder="เลือกสถานีตำรวจที่รับผิดชอบ" category="6" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title={'รายชื่อผู้รับผิดชอบในพื้นที่'}>
          <Space direction="vertical">
            <Button type="primary" onClick={() => setVisible(true)}>
              เพิ่ม
            </Button>
            <Form.Item name="agents" valuePropName="agents">
              <AreaOfResponsibilityTable edit onChange={onTableCheckboxChange} />
            </Form.Item>
          </Space>
          <Divider />
          <Space direction="vertical" align="end">
            <Space>
              <Button onClick={onBackClick}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" loading={state.actionLoading}>
                บันทึก
              </Button>
            </Space>
          </Space>
        </Card>
        <Form.Item shouldUpdate>
          {({ getFieldValue }) => {
            return (
              <PersonnelTransfer
                visible={state.personnelModalVisible}
                leftKeys={getFieldValue('agents')?.map((item) => item._id)}
                setVisible={setVisible}
                onSubmit={onTransferPersonnelSubmit}
              />
            );
          }}
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default AreaOfResponsibilityEdit;
