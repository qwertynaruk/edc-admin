import { Button, Form, Input, Skeleton, Space } from 'antd';
import DialogNotification from 'components/shared-components/DialogNotification';
import usePopup from 'hooks/usePopup';
import { observer } from 'mobx-react';
import UserStore from 'mobx/UserStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import useUser from 'hooks/services/useUser';
import SignatureUpload from './Component/SignatureUpload';

const UL = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 15px;
`;

const Signature = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { user } = useUser();

  const onCancelConfirm = () => {
    navigate('../');
  };
  const [fire] = usePopup({
    onConfirm: onCancelConfirm,
  });
  const { actionLoading } = UserStore;

  const onFinish = (values) => {
    UserStore.UpdateUser(user._id, values)
      .then(() => {
        DialogNotification('success', 'แก้ไขลายเซ็นสำเร็จ');
      })
      .catch((err) => {
        DialogNotification('error', 'แก้ไขลายเซ็นไม่สำเร็จ');
        return err;
      });
  };

  const onCancel = () => {
    if (user.signature === form.getFieldValue('signature')) {
      onCancelConfirm();
      return;
    }
    fire();
  };

  useEffect(() => {
    if (!user) return;
    form.setFieldsValue({
      signature: user.signature,
    });
  }, [user, form]);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      {!user && <Skeleton active />}
      <Form.Item hidden noStyle name="s3_upload_key">
        <Input type="hidden" />
      </Form.Item>
      {user && (
        <Space direction="vertical" className="gx-h-100 gx-justify-content-between">
          <Space direction="vertical">
            <Form.Item
              name="signature"
              rules={[
                {
                  required: true,
                  message: 'กรุณาอัปโหลดลายเซ็น',
                },
              ]}
            >
              <SignatureUpload form={form} />
            </Form.Item>
            <UL>
              <li>ขนาดรูปภาพที่แนะนำ 188 X 26 PX</li>
              <li>ขนาดไฟล์ไม่เกิน 10 MB</li>
              <li>นามสกุลไฟล์ .PNG</li>
            </UL>
          </Space>
          <Space className="gx-justify-content-end">
            <Button onClick={onCancel}>ยกเลิก</Button>
            <Button type="primary" htmlType="submit" loading={actionLoading}>
              บันทึก
            </Button>
          </Space>
        </Space>
      )}
    </Form>
  );
};

export default observer(Signature);
