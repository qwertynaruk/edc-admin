import { Button, Form, Input, InputNumber, Modal, Space } from 'antd';
import DialogNotification from 'components/shared-components/DialogNotification';
import GISZoneSelectWidget from 'components/shared-components/GISZoneSelectWidget';
import MasterSelectWidget from 'components/shared-components/MasterSelectWidget';
import produce from 'immer';
import { useState } from 'react';
import GISService from 'services/GISService';

const AddGIS = (props) => {
  const { visible } = props;
  const [form] = Form.useForm();
  const [state, setState] = useState({
    actionLoading: false,
  });
  const onSubmit = () => {
    // if (props.onSubmit) props.onSubmit();
    // props.setVisible(false);
    form.submit();
  };
  const onCancel = () => {
    if (props.onCancel) props.onCancel();
    props.setVisible(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    setState(
      produce((draft) => {
        draft.actionLoading = true;
      })
    );
    GISService.createZoneAgent({ data: { data: { ...values } } })
      .then(() => {
        DialogNotification('success', 'เพิ่มข้อมูลสารสนเทศภูมิศาสตร์สำเร็จ');
        props.setVisible(false);
        if (props.mutate) props.mutate();
      })
      .catch(() => DialogNotification('error', 'เพิ่มข้อมูลสารสนเทศภูมิศาสตร์ไม่สำเร็จ'))
      .finally(() => {
        setState(
          produce((draft) => {
            draft.actionLoading = false;
          })
        );
        form.resetFields();
      });
  };

  return (
    <Modal
      centered
      visible={visible}
      width={'400px'}
      title="เพิ่มข้อมูลสารสนเทศภูมิศาสตร์"
      style={{ marginTop: 20 }}
      onCancel={onCancel}
      destroyOnClose={true}
      footer={
        <Space className="gx-full-width gx-flex-end">
          <Button onClick={onCancel}>ยกเลิก</Button>
          <Button type="primary" onClick={onSubmit} loading={state.actionLoading}>
            บันทึก
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          label="พื้นที่ข้อมูลสารสนเทศภูมิศาสตร์"
          name="gis_zone_id"
          rules={[
            {
              required: true,
              message: 'กรุณาเลือกพื้นที่ข้อมูลสารสนเทศภูมิศาสตร์',
            },
          ]}
        >
          <GISZoneSelectWidget />
        </Form.Item>
        <Form.Item
          label="ชื่อพื้นที่"
          name="name"
          rules={[
            {
              required: true,
              message: 'กรุณากรอกชื่อพื้นที่',
            },
          ]}
        >
          <Input placeholder="กรอกชื่อพื้นที่รับผิดชอบ" />
        </Form.Item>
        <Form.Item
          label="จำนวนประชากรในพื้นที่"
          name="people_count"
          rules={[
            {
              required: true,
              message: 'กรุณากรอกจำนวนประชากรในพื้นที่',
            },
          ]}
        >
          <InputNumber min={0} type="number" placeholder="กรอกจำนวนประชากรในพื้นที่" className="gx-w-100" />
        </Form.Item>
        <Form.Item
          label="สถานีตำรวจที่รับผิดชอบ"
          name="police_station_name"
          rules={[
            {
              required: true,
              message: 'กรุณาเลือกสถานีตำรวจที่รับผิดชอบ',
            },
          ]}
        >
          <MasterSelectWidget placeholder="เลือกสถานีตำรวจที่รับผิดชอบ" category="6" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddGIS;
