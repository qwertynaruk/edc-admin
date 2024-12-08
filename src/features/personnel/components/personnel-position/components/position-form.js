import { Col, Form, Input, Row, Typography } from 'antd';

export const PositionForm = ({ form, onFinish }) => {
  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Typography.Title level={3} className="gx-pl-3 gx-mb-4">
        ข้อมูลพื้นฐาน
      </Typography.Title>
      <Row
        style={{
          flexDirection: 'row',
        }}
        gutter={[0, 0]}
      >
        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
          <Form.Item
            label="ชื่อตำแหน่ง (TH)"
            name="name_th"
            rules={[
              {
                required: true,
                message: 'กรุณากรอกชื่อตำแหน่ง (TH)',
              },
            ]}
          >
            <Input placeholder="ชื่อตำแหน่ง (TH)" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={4} xl={4} xxl={4}>
          <Form.Item
            label="ชื่อย่อ (TH)"
            name="short_name_th"
            rules={[
              {
                required: true,
                message: 'กรุณากรอกชื่อย่อ (TH)',
              },
            ]}
          >
            <Input placeholder="ชื่อย่อ (TH)" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
          <Form.Item
            label="ชื่อตำแหน่ง (EN)"
            name="name_en"
            rules={[
              {
                required: true,
                message: 'กรุณากรอกชื่อตำแหน่ง (EN)',
              },
            ]}
          >
            <Input placeholder="ชื่อตำแหน่ง (EN)" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={4} xl={4} xxl={4}>
          <Form.Item
            label="ชื่อย่อ (EN)"
            name="short_name_en"
            rules={[
              {
                required: true,
                message: 'กรุณากรอกชื่อย่อ (EN)',
              },
            ]}
          >
            <Input placeholder="ชื่อย่อ (EN)" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <Form.Item label="รายละเอียด" name="description">
            <Input placeholder="รายละเอียด" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
