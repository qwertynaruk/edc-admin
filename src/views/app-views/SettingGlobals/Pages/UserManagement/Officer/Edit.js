import { Form } from 'antd';
import DialogNotification from 'components/shared-components/DialogNotification';
import usePopup from 'hooks/usePopup';
import _ from 'lodash';
import { observer } from 'mobx-react';
import UserStore from 'mobx/UserStore';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserEditor from './UserEditor';

const EditUser = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [fireConfirmPopup] = usePopup();
  const { actionLoading } = UserStore;

  const [content_loading, setContentLoading] = useState(false);

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
      return;
    }
    goBack();
  };
  const onSubmit = (values) => {
    UserStore.UpdateUser(id, values)
      .then((resp) => {
        DialogNotification('success', 'แก้ไขผู้ใช้งานสำเร็จ');
        goBack();
      })
      .catch((err) => {
        DialogNotification('error', 'แก้ไขผู้ใช้งานไม่สำเร็จ');
        return err;
      });
  };

  useEffect(() => {
    setContentLoading(true);
    UserStore.GetUser(id)
      .then((resp) => {
        form.setFieldsValue(_.get(resp, 'data.user', {}));
      })
      .finally(() => {
        setContentLoading(false);
      });
  }, [form, id]);

  return (
    <UserEditor
      {...props}
      form={form}
      onSubmit={onSubmit}
      onCancel={onCancel}
      subpath={'เรียกดูผู้ใช้งาน'}
      contentLoading={content_loading}
      actionLoading={actionLoading}
      edit={true}
    />
  );
};

export default observer(EditUser);
