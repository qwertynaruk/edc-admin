import { Button, Form, Input, Modal, Space, Typography } from 'antd';

import DialogNotification from 'components/shared-components/DialogNotification';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useSpSelectStatusLostFound } from 'features/shared';
import { useUpdateLostFound } from 'features/lost-found/hooks';

export function ItemsRefundCancelledModal({ itemsId, visible, onClose }) {
  const [form] = Form.useForm();

  const { data: status } = useSpSelectStatusLostFound();
  const { mutate, isPending } = useUpdateLostFound({
    itemId: itemsId,
    onSuccess: () => {
      DialogNotification('success', 'ยกเลิกรายการสำเร็จ');
      onClose();
    },
    onError: () => {
      DialogNotification('error', 'ไม่สามารถทำรายการได้');
    },
  });

  const onFinish = (values) => {
    const payload = {
      status: status?.find((ss) => ss.label_en === 'Cancelled'),
      reason: values.reason,
    };

    mutate(payload);
  };

  return (
    <Modal
      centered
      visible={visible}
      onCancel={onClose}
      title={
        <Typography.Title level={5} style={{ marginBottom: 0 }}>
          <InfoCircleOutlined style={{ marginRight: 10 }} />
          เหตุผลการยกเลิกรายการ
        </Typography.Title>
      }
      footer={
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button loading={isPending} type="primary" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button loading={isPending} onClick={() => form.submit()}>
            ยืนยัน
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="reason"
          label="เหตุผล"
          rules={[{ required: true, message: 'กรุณาระบุเหตุผล' }]}
          style={{ marginBottom: 0 }}
        >
          <Input.TextArea placeholder="ระบุเหตุผล"></Input.TextArea>
        </Form.Item>
      </Form>
    </Modal>
  );
}
