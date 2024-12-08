import { Button, Form, Input } from 'antd';
import { useEffect, useState } from 'react';

import AlertErrorMessage from 'components/shared-components/AlertErrorMessage';
import DialogNotification from 'components/shared-components/DialogNotification';
import { PASSWORD_PATTERN } from 'constants/RegexPattern';
import UserService from 'services/UserService';
import UserStore from 'mobx/UserStore';
import _ from 'lodash';
import { observer } from 'mobx-react';
import produce from 'immer';

const rules = {
  password: [
    {
      required: true,
      message: 'กรุณากรอกรหัสผ่าน',
    },
    {
      pattern: PASSWORD_PATTERN,
      message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร และประกอบด้วยตัวอักษร ตัวเลข และอักขระพิเศษ',
    },
  ],
  confirm: [
    {
      required: true,
      message: 'กรุณายืนยันรหัสผ่าน',
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (!value || getFieldValue('new_password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน'));
      },
    }),
  ],
  name: [
    {
      required: true,
      message: 'กรุณากรอกรหัสผ่านเก่า',
    },
  ],
};

const ChangePassword = ({ confirmLoading = false, setConfirmLoading = () => {}, onFinish = () => {} }) => {
  const [form] = Form.useForm();
  const [state, setState] = useState({
    actionLoading: false,
    error: null,
  });
  const user = UserStore;
  useEffect(() => {
    if (confirmLoading) {
      form.submit();
    }
  }, [confirmLoading]);

  const onFinishDefault = async (values) => {
    await form.validateFields();
    setState(
      produce((draft) => {
        draft.error = null;
        draft.actionLoading = true;
      })
    );

    const data = _.omit(values, ['confirm_password']);
    data.db_name = user?.organization?.db_name;
    data.organization = user?.organization?.organization;

    UserService.change_password_police({
      data,
    })
      .then(() => {
        DialogNotification('success', 'เปลี่ยนรหัสผ่านสำเร็จ');
        UserStore.RefreshToken();
        form.resetFields();
        onFinish?.(state);
      })
      .catch((error) => {
        DialogNotification('error', 'เปลี่ยนรหัสผ่านไม่สำเร็จ');
        setState(
          produce((draft) => {
            draft.error = error.error;
          })
        );
        setConfirmLoading(false);
        return error;
      })
      .finally(() => {
        setState(
          produce((draft) => {
            draft.actionLoading = false;
          })
        );
      });
  };

  return (
    <Form
      name="changePasswordForm"
      layout="vertical"
      form={form}
      onFinish={onFinishDefault}
      scrollToFirstError
      onFinishFailed={() => {
        setConfirmLoading(false);
      }}
    >
      <Form.Item label="รหัสผ่านเก่า" name="old_password" rules={rules.name}>
        <Input.Password />
      </Form.Item>
      <Form.Item label="รหัสผ่านใหม่" name="new_password" rules={rules.password}>
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="ยืนยันรหัสผ่านใหม่"
        name="confirm_password"
        dependencies={['new_password']}
        rules={rules.confirm}
      >
        <Input.Password />
      </Form.Item>
      {state.error && <AlertErrorMessage message={state.error} />}
      {_.isEmpty(confirmLoading) ?? (
        <Button type="primary" htmlType="submit" loading={state.actionLoading}>
          เปลี่ยนรหัสผ่าน
        </Button>
      )}
    </Form>
  );
};

export default observer(ChangePassword);
