import { Button, Modal, Space, Typography } from 'antd';

import { InfoCircleOutlined } from '@ant-design/icons';
import TableHeros from 'components/shared-components/TableHeros';

export function ItemsRefundConfirmationModal({ visible, onClose }) {
  const columns = [
    {
      title: 'Claim ID',
      key: 'id',
      render: (items) => <Typography.Text>{items?.id}</Typography.Text>,
    },
    {
      title: 'ชื่อ - นามสกุล',
      key: 'full_name',
      render: (items) => <Typography.Text>{items?.full_name}</Typography.Text>,
    },
    {
      title: 'เบอร์โทร',
      key: 'telephone',
      render: (items) => <Typography.Text>{items?.telephone}</Typography.Text>,
    },
  ];

  return (
    <Modal
      centered
      visible={visible}
      title={null}
      onCancel={onClose}
      footer={
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button type="primary" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button>บันทึก</Button>
        </Space>
      }
    >
      <Space direction="vertical" size={20}>
        <Space>
          <InfoCircleOutlined style={{ marginRight: 10, fontSize: 48, color: '#ff0000' }} />
          <Space direction="vertical">
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              ยืนยันการคืนของหรือไม่ ?
            </Typography.Title>
            <Typography.Text>กรุณากดยืนยัน เพื่อบันทึกรายการคืนของดังต่อไปนี้</Typography.Text>
          </Space>
        </Space>

        <TableHeros columns={columns.filter((ss) => ss.key !== 'id')} dataSource={[]} pagination={false} />
        <Space direction="vertical">
          <Typography.Title level={5} style={{ marginBottom: 0 }}>
            รายการเคลมของไอเท็มชิ้นนี้
          </Typography.Title>
          <Typography.Text>
            จะเปลี่ยนเป็น <span style={{ color: '#ff0000' }}>Cancelled</span> อัตโนมัติ
          </Typography.Text>
        </Space>
        <TableHeros columns={columns} dataSource={[]} pagination={false} />
      </Space>
    </Modal>
  );
}
