import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Typography, notification } from 'antd';

import Flex from 'components/shared-components/Flex';

import { useChangeIncidentManagementStatus } from '../../api/change-incident-management-status';

export const IncidentManagementChangeCancelStatusConfirmDialog = ({ open, onClose, incidentId }) => {
  const { submit, ...changeIncidentManagementStatus } = useChangeIncidentManagementStatus({
    incidentId,
    onSuccess: () => {
      notification.success({
        message: 'สำเร็จ',
        description: 'บันทึกสถานะสำเร็จ',
      });
      onClose();
    },
  });

  return (
    <Modal visible={open} onCancel={onClose} footer={null} centered>
      <Form
        onFinish={(values) => {
          submit({
            status: 'ยกเลิก',
            status_reason: values.status_reason,
          });
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: 16,
          }}
        >
          <ExclamationCircleOutlined style={{ fontSize: 56, color: '#f7bb86', marginBottom: 16 }} />
          <Typography.Title level={4}>ยืนยันการยกเลิกรายการ</Typography.Title>
          <Typography.Text className="gx-mb-3">กรุณาระบุเหตุผลในการยกเลิก</Typography.Text>
          <Form.Item
            name="status_reason"
            className="gx-w-100"
            rules={[
              {
                required: true,
                message: 'กรุณาระบุเหตุผลในการยกเลิก',
              },
            ]}
          >
            <Input.TextArea rows={5} style={{ width: '100%' }} />
          </Form.Item>
          <Flex alignItems="center" alignContent="center">
            <Button onClick={onClose} style={{ marginRight: 12 }}>
              ยกเลิก
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              danger
              style={{
                backgroundColor: '#f5222d !important',
                borderColor: '#f5222d !important',
              }}
              loading={changeIncidentManagementStatus.isLoading}
            >
              ยืนยัน
            </Button>
          </Flex>
        </div>
      </Form>
    </Modal>
  );
};
