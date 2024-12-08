import { Card, Form, Select, Typography } from 'antd';

import { css } from '@emotion/css';

export const MassNotificationOfficerBoundary = ({ form }) => {
  return (
    <Card
      className={css`
        .ant-card-body {
          min-height: 85vh;
        }
      `}
    >
      <Typography.Title level={4}>ขอบเขตพื้นที่การสื่อสาร</Typography.Title>
      <Form form={form} layout="vertical">
        <Form.Item
          label="ช่องทางการสื่อสาร"
          name="communicationChannel"
          rules={[{ required: true, message: 'กรุณาเลือกช่องทางการสื่อสาร' }]}
        >
          <Select />
        </Form.Item>
        <Form.Item label="หน่วยงาน" name="agency" rules={[{ required: true, message: 'กรุณาเลือกหน่วยงาน' }]}>
          <Select />
        </Form.Item>
        <Form.Item label="ฝ่ายงาน" name="division" rules={[{ required: true, message: 'กรุณาเลือกฝ่ายงาน' }]}>
          <Select />
        </Form.Item>
      </Form>
    </Card>
  );
};
