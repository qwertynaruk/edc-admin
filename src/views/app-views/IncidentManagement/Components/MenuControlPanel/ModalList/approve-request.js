import { Button, Form, Input, Modal, Space, Table, Typography } from 'antd';
import { observer } from 'mobx-react';
import ReportStore from 'mobx/ReportStore';
import { useState } from 'react';

const ApproveRequest = ({ visible, setVisible }) => {
  const [form] = Form.useForm();
  const { reviewsList = [] } = ReportStore;
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: 'วันที่ทำรายการ',
      dataIndex: 'date',
      sorter: (a, b) => a.date > b.date,
    },
    {
      title: 'สถานะคำขออนุมัติ',
      dataIndex: 'status',
      sorter: (a, b) => a.status > b.status,
    },
    {
      title: 'ชื่อผู้ใช้',
      dataIndex: 'user',
      sorter: (a, b) => a.user > b.user,
    },
    {
      title: 'รายละเอียด',
      dataIndex: 'user',
    },
  ];

  const onFinishForm = (values) => {
    setLoading(true);
    ReportStore.createReviews({
      ...values,
      status: 'request',
    }).finally(() => setLoading(false));
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => {
        setVisible(false);
        form.resetFields();
      }}
      title="ขออนุมัติ"
      footer={null}
      centered={true}
      forceRender
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={onFinishForm}>
        <Form.Item name="detail" label="รายละเอียด" rules={[{ required: true, message: 'กรุณากรอกรายละเอียด' }]}>
          <Input.TextArea />
        </Form.Item>

        <Space className="gx-full-width gx-flex-end">
          <Button type="primary" htmlType="submit">
            อนุมัติ
          </Button>
        </Space>
      </Form>

      <div className="gx-mt-4">
        <Typography.Text strong>ประวัติการขออนุมัติ</Typography.Text>
        <Table
          className="gx-table-no-bordered gx-mt-1"
          columns={columns}
          dataSource={reviewsList}
          pagination={false}
          bordered={false}
          size="small"
          loading={loading}
        />
      </div>
    </Modal>
  );
};

export default observer(ApproveRequest);
