import { Button, Col, Divider, Form, Input, Radio, Row, Space, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';

import DialogNotification from 'components/shared-components/DialogNotification';
import GISService from 'services/GISService';
import Guarded from 'components/shared-components/Guarded';
import MapFrame from 'views/app-views/OneCommand/Components/MapFrame';
import { currentLocation } from 'constants/MapConstant';
import produce from 'immer';
import useGISZone from 'hooks/services/useGISZone';

const { Text } = Typography;

const GISForm = (props) => {
  const frameHeight = window.outerHeight - 40;
  const [form] = Form.useForm();
  const [state, setState] = useState({
    actionLoading: false,
  });
  const { data: zone, loading, mutate } = useGISZone(props.id ? { params: { zone_id: props.id } } : null);

  useEffect(() => {
    if (!zone) return;
    form.setFieldsValue(zone);
  }, [form, zone]);

  const onFinish = (values) => {
    setState(
      produce((draft) => {
        draft.actionLoading = true;
      })
    );
    mutate(GISService.updateZone({ params: { zone_id: zone._id }, data: { data: values } }))
      .then(() => {
        DialogNotification('success', 'แก้ไขข้อมูลข้อมูลสารสนเทศภูมิศาสตร์สำเร็จ');
        if (props.mutate) {
          props.mutate();
        }
      })
      .catch(() => DialogNotification('error', 'แก้ไขข้อมูลข้อมูลสารสนเทศภูมิศาสตร์ไม่สำเร็จ'))
      .finally(() => {
        setState(
          produce((draft) => {
            draft.actionLoading = false;
          })
        );
      });
  };

  return (
    <Spin spinning={loading}>
      <Form layout="vertical" className="gx-p-4" form={form} onFinish={onFinish}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item label="ชื่อข้อมูลสารสนเทศภูมิศาสตร์" name="name" required>
              <Input placeholder="กรอกชื่อข้อมูลสารสนเทศภูมิศาสตร์" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="รายละเอียด" name="description">
              <Input placeholder="กรอกรายละเอียด" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="สถานะปัจจุบัน" name="is_delete">
              <Radio.Group>
                <Radio value={false}>ใช้งาน</Radio>
                <Radio value={true}>ไม่ใช้งาน</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Text>แผนที่</Text>
            <MapFrame
              options={{
                searchBox: false,
              }}
              currentLocation={currentLocation}
              frameHeight={frameHeight}
              gisData={zone?.gis_datas}
            />
          </Col>
        </Row>
        <Guarded
          query={{
            group: 'System Administration',
            type: 'ข้อมูลสารสนเทศภูมิศาสตร์',
            name: 'แก้ไขข้อมูลสารสนเทศภูมิศาสตร์',
          }}
        >
          <Divider />
          <Space direction="vertical" align="end">
            <Space>
              <Button onClick={props.onCancel}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" loading={state.actionLoading}>
                บันทึก
              </Button>
            </Space>
          </Space>
        </Guarded>
      </Form>
    </Spin>
  );
};

export default GISForm;
