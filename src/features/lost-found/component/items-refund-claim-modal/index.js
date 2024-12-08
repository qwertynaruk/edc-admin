import { Button, Checkbox, Form, Modal, Radio, Select, Space, Typography } from 'antd';

import { InfoCircleOutlined } from '@ant-design/icons';
import TableHeros from 'components/shared-components/TableHeros';

const dataSource = [{ id: 'x', full_name: 'รายการขอคืน ที่ไม่มีในคำขอ Claim' }];

export function ItemsRefundClaimModal({ visible, onClose }) {
  const [form] = Form.useForm();

  const sharedOnCell = (_, index) => {
    if (index === dataSource.length - 1) {
      return {
        colSpan: 0,
      };
    }
    return {};
  };

  const columns = [
    {
      title: 'Claim ID',
      key: 'id',
      render: (_, items, index) => (
        <Space>
          <Radio value={items?.id} />
          <Typography.Text>{index === dataSource.length - 1 ? items?.full_name : items?.id}</Typography.Text>
        </Space>
      ),
      onCell: (_, index) => ({
        colSpan: index === dataSource.length - 1 ? 3 : 1,
      }),
    },
    {
      title: 'ชื่อ - นามสกุล',
      key: 'full_name',
      render: (items) => (
        <Space>
          <Typography.Text>{items?.full_name}</Typography.Text>
        </Space>
      ),
      onCell: sharedOnCell,
    },
    {
      title: 'เบอร์โทร',
      key: 'telephone',
      render: (items) => (
        <Space>
          <Typography.Text>{items?.telephone}</Typography.Text>
        </Space>
      ),
      onCell: sharedOnCell,
    },
  ];

  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <Modal
      centered
      visible={visible}
      onCancel={onClose}
      title={
        <Typography.Title level={5} style={{ marginBottom: 0 }}>
          <InfoCircleOutlined style={{ marginRight: 10 }} />
          เลือกรายการเคลมที่ต้องการคืนไอเท็ม
        </Typography.Title>
      }
      footer={
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button type="primary" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button onClick={() => form.submit()}>ทำรายการคืน</Button>
        </Space>
      }
    >
      <Radio.Group style={{ width: '100%' }}>
        <TableHeros columns={columns} dataSource={dataSource} pagination={false} />
      </Radio.Group>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="refund_from_lost" valuePropName="checked">
          <Checkbox>คืนจากรายการแจ้งของหาย</Checkbox>
        </Form.Item>

        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) =>
            getFieldValue('refund_from_lost') ? (
              <Form.Item label="รายการแจ้งของหาย" rules={[{ required: true, message: 'กรุณาเลือกรายการแจ้งของหาย' }]}>
                <Select placeholder="เลือกรายการแจ้งของหาย">
                  <Select.Option value="RLA20250100001">RLA20250100001</Select.Option>
                </Select>
              </Form.Item>
            ) : null
          }
        </Form.Item>
      </Form>
    </Modal>
  );
}
