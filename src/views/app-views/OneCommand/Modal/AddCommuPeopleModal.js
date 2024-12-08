import { Col, Dropdown, Form, Input, Menu, Modal, Row, Select } from 'antd';
import MassNotificationStore, { CASE_STATUS } from 'mobx/MassNotificationStore';
import { useEffect, useState } from 'react';

import { AlertTypeList } from 'constants/AlertTypeConstant';
import DatePicker from 'components/shared-components/DatePicker';
import DialogNotification from 'components/shared-components/DialogNotification';
import { DownOutlined } from '@ant-design/icons';
import PublishedTimeModal from './PublishedTimeModal';
import moment from 'moment';
import { observer } from 'mobx-react';
import { useWatch } from 'antd/lib/form/Form';

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

const AddCommuPeopleModal = ({ visible, setVisible, record }) => {
  const [form] = Form.useForm();
  const [publishedTimeModalVisible, setPublishedTimeModalVisible] = useState(false);
  const [onMenuChange, setOnMenuChange] = useState('0');
  const alertType = useWatch('alertType', form);
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
    let data = { ...values, receiver_type_id: 'people' };
    if (onMenuChange === '0') {
      let mapTextMessage = '';
      if (values.incident_date_time) {
        mapTextMessage = `เวลา${moment(values.incident_date_time).add(543, 'year').format('DD/MM/YYYY HH:mm')}`;
      }
      if (values.incident_address) {
        mapTextMessage = `${mapTextMessage}สถานที่${values.incident_address}`;
      }
      if (values.message) {
        mapTextMessage = `${mapTextMessage}รายละเอียด${values.message}`;
      }
      if (values.advice) {
        mapTextMessage = `${mapTextMessage}คำแนะนำ${values.advice}`;
      }
      data = { ...data, status: CASE_STATUS.SEND, message: mapTextMessage };
    }
    if (onMenuChange === '2') {
      data = { ...data, publish_time: null, status: CASE_STATUS.DRAFT };
    } else if (values.publish_time) {
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
        form.resetFields();
      }
      return;
    }
    form?.setFieldsValue(record);
  }, [form, record, visible]);

  return (
    <>
      <Modal
        title={record ? 'แก้ไขข้อความสื่อสาร' : 'เพิ่มข้อความสื่อสาร'}
        visible={visible}
        width={900}
        centered
        footer={null}
        onCancel={handleCancel}
        destroyOnClose={true}
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} preserve={false}>
          <Row className="gx-flex-row">
            <Col span={8}>
              <Form.Item
                label="ประเภทการเตือน"
                name="alertType"
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกประเภทการเตือน',
                  },
                ]}
              >
                <Select options={AlertTypeList} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="วันเวลาคาดการณ์" name="incident_date_time">
                <DatePicker showTime={{ format: 'HH:mm' }} className="gx-full-width" placeholder="เลือกวันที่" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="สถานที่"
                name="incident_address"
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกสถานที่',
                  },
                ]}
              >
                <Input placeholder="กรอกสถานที่" />
              </Form.Item>
            </Col>
            {/* <Col span={8}>
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
            </Col> */}
            {alertType === 'อื่น ๆ' && (
              <Col span={24}>
                <Form.Item
                  label="ระบุประเภทการเตือน"
                  name="alertTypeTitle"
                  rules={[
                    {
                      required: true,
                      message: 'กรุณาระบุประเภทการเตือน',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            )}
            <Col span={24}>
              <Form.Item label="รายละเอียด" name="message">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="คำแนะนำ (ถ้ามี)" name="advice">
                <Input />
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
          <PublishedTimeModal
            form={form}
            visible={publishedTimeModalVisible}
            setVisible={setPublishedTimeModalVisible}
          />
        </Form>
      </Modal>
    </>
  );
};

export default observer(AddCommuPeopleModal);
