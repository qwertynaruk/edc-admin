import { Form, Input, Modal, Typography, notification } from 'antd';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { useDeletePersonnel } from 'features/personnel/api/delete-personnel';

export const PersonnelDeleteDialog = ({ title = '', keyWord = '', open, onClose, personnel }) => {
  const [form] = Form.useForm();

  const deletePersonnel = useDeletePersonnel({
    onSuccess: () => {
      notification.success({
        message: 'สำเร็จ',
        description: 'ลบข้อมูลผู้ใช้เรียบร้อยแล้ว',
      });
    },
  });

  const onFinish = async () => {
    try {
      await form.validateFields();
      deletePersonnel.submit(personnel?.id);
      onClose?.();
    } catch (error) {
      console.error(error);
    }
  };

  const VERIFY_TEXT = `${personnel?.first_name}`;

  return (
    <Modal
      centered
      visible={open}
      onCancel={onClose}
      okText="ยืนยัน"
      onOk={onFinish}
      okButtonProps={{
        danger: true,
      }}
      className={css`
        .ant-btn-dangerous {
          background-color: #ff4d4f !important;
          border-color: #ff4d4f !important;
        }
      `}
      afterClose={() => {
        form.resetFields();
      }}
    >
      <div
        className={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 12px;
        `}
      >
        <ExclamationCircleOutlined
          className="gx-text-danger gx-fs-xl gx-mb-3 gx-text-center"
          style={{
            fontSize: 72,
          }}
        />
        <Typography.Title level={4} className="gx-text-center gx-mb-0">
          ยืนยันการลบ{title}
        </Typography.Title>
        <Typography.Text className="gx-text-center">กรุณากรอกข้อความต่อไปนี้</Typography.Text>
        <Typography.Text className="gx-text-center">
          {'"'}
          <span className="gx-text-danger gx-font-weight-bold">{VERIFY_TEXT}</span>
          {'"'} เพื่อยืนยันการลบ
        </Typography.Text>
        <Form form={form} className="gx-mt-2 gx-pl-4 gx-pr-4">
          <Form.Item
            name="verify"
            rules={[
              {
                required: true,
                message: 'กรุณากรอกข้อความ',
              },
              {
                validator: (_, value) => {
                  if (value?.toLowerCase() !== VERIFY_TEXT?.toLowerCase() && value) {
                    return Promise.reject(new Error('ข้อความไม่ถูกต้อง'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="กรอกข้อความ" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};
