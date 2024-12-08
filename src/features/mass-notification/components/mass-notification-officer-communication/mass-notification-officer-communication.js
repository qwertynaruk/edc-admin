import { Button, Card, Divider, Dropdown, Form, Input, Menu, Select, Typography } from 'antd';

import { DownOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';
import { GoogleMapAddressPicker } from 'components/shared-components/google-map-address-picker';
import { css } from '@emotion/css';

export const MassNotificationOfficerCommunication = () => {
  return (
    <Card
      className={css`
        .ant-card-body {
          min-height: 85vh;
        }
      `}
    >
      <Form layout="vertical">
        <Typography.Title level={4}>ข้อความสื่อสาร</Typography.Title>
        <Form.Item label="ประเภทการเตือน" name="type" rules={[{ required: true, message: 'กรุณาเลือกประเภทการเตือน' }]}>
          <Select className="gx-w-100" />
        </Form.Item>
        <Form.Item label="รายละเอียดข้อความ" name="message">
          {/* <Ckeditor minHeight={180} maxHeight={180} /> */}
          <Input.TextArea></Input.TextArea>
        </Form.Item>
        <Form.Item>
          <GoogleMapAddressPicker />
        </Form.Item>
        <Form.Item label="สถานที่" name="location">
          <Input />
        </Form.Item>
        <Divider />
        <Flex justifyContent="end">
          <Button>ยกเลิก</Button>
          <Dropdown.Button
            type="primary"
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
              />
            }
            trigger={['click']}
            icon={<DownOutlined />}
          >
            เผยแผร่
          </Dropdown.Button>
        </Flex>
      </Form>
    </Card>
  );
};
