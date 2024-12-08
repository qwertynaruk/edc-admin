import { Button, Card, Col, Divider, Dropdown, Form, Input, Menu, Modal, Row, Select, Space, Typography } from 'antd';
import { useGetChannelList, useGetWarningLists } from 'features/mass-notification/hooks';

import { CitizenCommunicationMap } from './components/citizen-communication-map';
import { DownOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';
import { OneforceSelection } from 'features/shared';
import { useState } from 'react';

export const MassNotificationCitizenCommunication = ({
  form,
  loading,
  onFinish,
  onCancel,
  setFormStatus,
  locationMarker,
  setLocationMarker,
}) => {
  const { data: warningDatas, isPending } = useGetWarningLists();
  const { data: channelData } = useGetChannelList();
  const [open, setOpen] = useState(false);

  const openMapsModal = () => {
    setOpen(true);
  };

  const onSubmitLocation = () => {
    setOpen(false);
    form.setFieldValue('address', locationMarker.addressTxt);
  };

  const formMenuClick = (items) => {
    setFormStatus(items.key);
    form.submit();
  };

  return (
    <Card>
      <Typography.Title level={4}>ข้อความสื่อสาร</Typography.Title>
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          type: 'radius',
        }}
        onFinish={onFinish}
      >
        <Row
          gutter={[12, 12]}
          style={{
            flexDirection: 'row',
          }}
        >
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              name="noti_category_id"
              label="ประเภทการเตือน"
              rules={[
                {
                  required: true,
                  message: 'กรุณาเลือกประเภทการเตือน',
                },
              ]}
            >
              <OneforceSelection
                selectProps={{
                  placeholder: 'เลือกประเภทการเตือน',
                  loading: isPending,
                }}
                optionProps={{
                  data: warningDatas,
                  dataValue: 'id',
                  dataLabel: 'name_th',
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              name="type"
              label="ประเภทการแจ้งเตือน"
              rules={[
                {
                  required: true,
                  message: 'กรุณาเลือกประเภทการแจ้งเตือน',
                },
              ]}
              required
            >
              <Select
                placeholder="เลือกประเภทการแจ้งเตือน"
                options={[
                  {
                    label: 'รัศมี',
                    value: 'radius',
                  },
                  {
                    label: 'พื้นที่',
                    value: 'area',
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="detail_message"
          label="รายละเอียดข้อความ"
          rules={[
            {
              required: true,
              message: 'กรุณากรอกรายละเอียดข้อความ',
            },
          ]}
          required
        >
          <Input.TextArea rows={3} placeholder="กรอกรายละเอียดข้อความ" />
        </Form.Item>
        <Form.Item
          name="address"
          label="สถานที่"
          rules={[
            {
              required: true,
              message: 'กรุณาเลือกสถานที่',
            },
          ]}
        >
          <Input
            addonBefore={
              <Button onClick={openMapsModal} style={{ backgroundColor: 'transparent' }}>
                ดึงข้อมูลจากแผนที่
              </Button>
            }
          />
        </Form.Item>
        <Form.Item
          name="channels"
          label="ช่องทางการสื่อสาร"
          rules={[
            {
              required: true,
              message: 'กรุณาเลือกช่องทางการสื่อสาร',
            },
          ]}
        >
          <OneforceSelection
            selectProps={{
              placeholder: 'เลือกช่องทางการสื่อสาร',
              mode: 'multiple',
            }}
            optionProps={{
              data: channelData,
              dataValue: 'value',
              dataLabel: 'label',
            }}
          />
        </Form.Item>

        <Divider />
        <Flex justifyContent="end">
          <Button onClick={() => onCancel()}>ยกเลิก</Button>
          <Dropdown.Button
            type="primary"
            loading={loading}
            overlay={
              <Menu
                items={[
                  {
                    label: 'กำหนดเวลาเผยแพร่',
                    key: 'schedule',
                  },
                  {
                    label: 'บันทึกเป็นฉบับร่าง',
                    key: 'draft',
                  },
                ]}
                onClick={formMenuClick}
              />
            }
            trigger={['click']}
            icon={<DownOutlined />}
            onClick={() => formMenuClick({ key: 'publish' })}
          >
            เผยแผร่
          </Dropdown.Button>
        </Flex>
      </Form>

      <Modal
        centered
        visible={open}
        onCancel={() => setOpen(false)}
        destroyOnClose={true}
        title="เลือกสถานที่"
        width={1000}
        footer={
          <Space className="gx-full-width gx-flex-end">
            <Button onClick={() => setOpen(false)}>ยกเลิก</Button>
            <Button type="primary" onClick={onSubmitLocation}>
              บันทึก
            </Button>
          </Space>
        }
      >
        <CitizenCommunicationMap locationMarker={locationMarker} setLocationMarker={setLocationMarker} />
      </Modal>
    </Card>
  );
};
