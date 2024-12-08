import { Form } from 'antd';
import DialogNotification from 'components/shared-components/DialogNotification';
import usePopup from 'hooks/usePopup';
import _ from 'lodash';
import { observer } from 'mobx-react';
import UserStore from 'mobx/UserStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserEditor from './UserEditor';

const CreateUser = ({ ...props }) => {
  const [form] = Form.useForm();
  const [fireConfirmPopup] = usePopup();
  const { actionLoading } = UserStore;
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
    form.resetFields();
  };
  const onCancel = () => {
    if (form.isFieldsTouched()) {
      fireConfirmPopup().then((res) => {
        if (res.isConfirmed) {
          goBack();
        }
      });
    }
  };
  const onSubmit = (values) => {
    setErrorMessage(null);
    UserStore.CreateUser(_.omit(values, ['password_confirmation']))
      .then((resp) => {
        DialogNotification('success', 'สร้างผู้ใช้งานสำเร็จ');
        goBack();
      })
      .catch((err) => {
        const message = err.response.data.body.message;
        DialogNotification('error', 'สร้างผู้ใช้งานไม่สำเร็จ');
        setErrorMessage(message);
      });
  };

  return (
    <UserEditor
      {...props}
      form={form}
      onSubmit={onSubmit}
      onCancel={onCancel}
      actionLoading={actionLoading}
      errorMessage={errorMessage}
    />
  );
};

export default observer(CreateUser);
