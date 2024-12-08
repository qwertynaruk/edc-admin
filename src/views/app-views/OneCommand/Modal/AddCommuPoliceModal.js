import { useEffect, useState } from 'react';
import { Col, Dropdown, Form, Input, Menu, Modal, Row } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import PublishedTimeModal from './PublishedTimeModal';
import MassNotificationStore, { CASE_STATUS } from 'mobx/MassNotificationStore';
import DialogNotification from 'components/shared-components/DialogNotification';
import DepartmentSelectWidget from 'components/shared-components/DepartmentSelectWidget';

const dataMention = [
  {
    label: 'วันที่',
    value: 'วันที่',
    submenu: [
      {
        label: moment().format('MM/DD/YYYY'),
        value: moment().format('MM/DD/YYYY'),
      },
    ],
  },
  {
    label: 'เจ้่าหน้าที่',
    value: 'เจ้าหน้าที่',
    submenu: [{ label: 'นาย', value: 'นาย' }],
  },
  {
    label: 'ทรัพย์สิน',
    value: 'ทรัพย์สิน',
    submenu: [{ label: '200,000', value: '200,000' }],
  },
  {
    label: 'บุคคล',
    value: 'บุคคล',
    submenu: [{ label: 'นายดี มีชัย', value: 'นายดี มีชัย' }],
  },
  {
    label: 'ยานพาหนะ',
    value: 'ยานพาหนะ',
    submenu: [{ label: 'Honda City', value: 'Honda City' }],
  },
  {
    label: 'สถานที่',
    value: 'สถานที่',
    submenu: [{ label: 'โรงเรียน', value: 'โรงเรียน' }],
  },
  {
    label: 'องค์กร',
    value: 'องค์กร',
    submenu: [{ label: 'อะไรก็ได้', value: 'อะไรก็ได้' }],
  },
];

const AddCommuPoliceModal = ({ visible, setVisible, record }) => {
  const [form] = Form.useForm();
  const [onMenuChange, setOnMenuChange] = useState('0');
  const [publishedTimeModalVisible, setPublishedTimeModalVisible] = useState(false);

  const handleCancel = () => {
    setVisible(false);
  };

  const datamenu = [
    { label: 'บันทึกเป็นฉบับร่าง', key: '2' },
    { label: 'กำหนดเวลาโพสต์', key: '1' },
    { label: 'เผยแพร่', key: '0' },
  ];

  const menu = (
    <Menu
      onClick={(e) => {
        setOnMenuChange(e.key);
      }}
      items={datamenu.filter((e) => e.key !== onMenuChange)}
    />
  );

  const handleSubmit = (values) => {
    let data = { ...values, receiver_type_id: 'police' };
    if (onMenuChange === '0') {
      data = { ...data, status: CASE_STATUS.SEND };
    }
    if (onMenuChange === '2') {
      data = { ...data, status: CASE_STATUS.DRAFT };
    }
    if (values.publish_time) {
      data = { ...data, publish_time: values.publish_time.toISOString() };
    }
    if (record) {
      MassNotificationStore.Update([record], data)
        .then(() => {
          DialogNotification('success', 'อัพเดทสำเร็จ');
          setPublishedTimeModalVisible(false);
          setVisible(false);
        })
        .catch(() => {
          DialogNotification('error', 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        });
      return;
    }
    MassNotificationStore.Post(data)
      .then(() => {
        DialogNotification('success', 'ส่งข้อความสำเร็จ');
        setPublishedTimeModalVisible(false);
        setVisible(false);
      })
      .catch(() => {
        DialogNotification('error', 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      });
  };

  const onButtonClick = () => {
    if (onMenuChange === '0' || onMenuChange === '2') {
      form?.submit();
      return;
    }
    setPublishedTimeModalVisible(true);
  };

  useEffect(() => {
    if (!record) {
      setOnMenuChange('2');
      if (form) {
        form?.resetFields();
      }
      return;
    }
    form?.setFieldsValue(record);
  }, [form, record]);

  return (
    <>
      <Modal
        title="เพิ่มข้อความสื่อสาร"
        visible={visible}
        width={900}
        centered
        footer={null}
        onCancel={handleCancel}
        maskClosable={false}
        destroyOnClose={true}
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} preserve={false}>
          <Row className="gx-flex-row" gutter={[16, 16]}>
            <Col span={18}>
              <Form.Item
                label="หัวข้อ"
                name="title"
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกหัวข้อ',
                  },
                ]}
              >
                <Input placeholder="กรอกหัวข้อ" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="ฝ่ายงาน"
                name="investigate_team"
                rules={[
                  {
                    required: true,
                    message: 'กรุณาเลือกฝ่ายงาน',
                  },
                ]}
              >
                <DepartmentSelectWidget mode="multiple" placeholder="เลือกฝ่ายงาน" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="รายละเอียดข้อความ" name="message">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>

            <Col span={24} className="gx-flex-row gx-justify-content-end">
              <Dropdown.Button
                icon={<DownOutlined />}
                overlay={menu}
                onClick={onButtonClick}
                loading={MassNotificationStore.actionLoading}
              >
                {datamenu.find((e) => e.key === onMenuChange).label}
              </Dropdown.Button>
            </Col>
          </Row>
        </Form>
      </Modal>

      <PublishedTimeModal form={form} visible={publishedTimeModalVisible} setVisible={setPublishedTimeModalVisible} />
    </>
  );
};

export default AddCommuPoliceModal;
