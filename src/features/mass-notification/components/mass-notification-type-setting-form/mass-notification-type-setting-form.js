import { Button, Col, Divider, Form, Input, Row, Typography } from 'antd';
import Flex from 'components/shared-components/Flex';

export const MassNotificationTypeSettingForm = () => {
  return (
    <Form layout="vertical">
      <Typography.Title
        level={4}
        style={{
          marginBottom: 16,
        }}
      >
        ประเภทการเตือน
      </Typography.Title>
      <Row
        gutter={[16, 0]}
        style={{
          flexDirection: 'row',
        }}
      >
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Form.Item
            label=" ชื่อประเภทการเตือน TH"
            name="nameTh"
            rules={[
              {
                required: true,
                message: 'กรุณากรอกชื่อประเภทการเตือน TH',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Form.Item
            label=" ชื่อประเภทการเตือน EN"
            name="nameEn"
            rules={[
              {
                required: true,
                message: 'กรุณากรอกชื่อประเภทการเตือน EN',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <Form.Item label="รายละเอียด">
            <Input.TextArea />
          </Form.Item>
        </Col>
      </Row>
      <Divider />
      <Flex justifyContent="end">
        <Button>ยกเลิก</Button>
        <Button type="primary">บันทึก</Button>
      </Flex>
    </Form>
  );
};
