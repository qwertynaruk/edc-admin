import { Button, Card, Checkbox, Col, Collapse, DatePicker, Divider, Form, Row, Typography } from 'antd';
import { SpSelectItemModel, SpSelectStatusLostFound } from 'features/shared';

import styled from '@emotion/styled';

const { Panel } = Collapse;
const { RangePicker } = DatePicker;

export function FilterCardDrawer() {
  const [form] = Form.useForm();

  return (
    <Card bodyStyle={{ padding: 0 }}>
      <div style={{ padding: '10px 15px' }}>
        <Typography.Title level={5} style={{ marginBottom: 0 }}>
          Filter
        </Typography.Title>
      </div>

      <Form form={form} layout="vertical">
        <CollapseComponent defaultActiveKey={['1', '2']}>
          <Panel header="Date Time" key={1}>
            <Form.Item label="Start Time" name="start_time">
              <RangePicker />
            </Form.Item>
          </Panel>
          <Panel header="รายละเอียดไอเท็ม" key={2}>
            <Form.Item label="Status" name="status">
              <SpSelectStatusLostFound />
            </Form.Item>

            <Form.Item label="Model" name="model">
              <SpSelectItemModel />
            </Form.Item>

            {/* category=phone only */}
            <Form.Item label="" name="registered">
              <Checkbox>สินทรัพย์ลงทะเบียนแล้ว</Checkbox>
            </Form.Item>
            {/* category=phone only */}
          </Panel>
        </CollapseComponent>

        <Divider style={{ borderColor: '#000' }} />

        <Row gutter={[8, 8]} style={{ flexDirection: 'row', padding: '0 15px 10px 15px' }}>
          <Col xs={12}>
            <Button type="text" style={{ width: '100%' }}>
              รีเซ็ต
            </Button>
          </Col>
          <Col xs={12}>
            <Button type="primary" style={{ width: '100%' }}>
              ค้นหา
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}

const CollapseComponent = styled(Collapse)({
  borderRadius: 0,
  backgroundColor: '#1C2536 !important',
  borderColor: '#000 !important',
  borderRight: 0,
  borderLeft: 0,
  '.ant-collapse-header': {
    backgroundColor: '#181D28',
    display: 'flex',
  },
  '> .ant-collapse-item': {
    borderColor: 'transparent !important',

    '&:last-child': {
      borderRadius: 0,

      '> .ant-collapse-content': {
        borderRadius: 0,
      },
    },
  },
  '.ant-collapse-content': {
    backgroundColor: '#1C2536',
    borderTopColor: 'transparent',
  },
});
