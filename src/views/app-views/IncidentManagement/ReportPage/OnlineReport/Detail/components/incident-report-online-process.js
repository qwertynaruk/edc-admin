import { Button, Card, Divider, Form, Select } from 'antd';

import Flex from 'components/shared-components/Flex';

export const IncidentReportOnlineProcess = () => {
  return (
    <Card title="การดำเนินการ">
      <Form
        initialValues={{
          status: 'pending',
        }}
        layout="vertical"
        style={{
          margin: 0,
        }}
      >
        <Form.Item label="สถานะ">
          <Select
            options={[
              {
                label: 'รอดำเนินการ',
                value: 'pending',
              },
              {
                label: 'เสร็จสิ้น',
                value: 'complete',
              },
            ]}
          />
        </Form.Item>
        <Divider />
        <Flex justifyContent="end">
          <Button>ยกเลิก</Button>
          <Button type="primary" style={{ marginLeft: 4 }}>
            บันทึก
          </Button>
        </Flex>
      </Form>
    </Card>
  );
};
