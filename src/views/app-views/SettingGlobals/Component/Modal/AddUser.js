import { observer } from 'mobx-react';
import { Button, Form, Modal, Space } from 'antd';
import usePopup from 'hooks/usePopup';
import UserSelectWidget from 'components/shared-components/UserSelectWidget';

const AddUser = ({ visible, setVisible, setUsers }) => {
  const [form] = Form.useForm();
  const [fireConfirmPopup] = usePopup({
    onConfirm: () => setVisible(false),
  });

  const onCancel = () => {
    if (form.isFieldsTouched()) {
      fireConfirmPopup();
      return;
    }
    setVisible(false);
  };
  const onAfterClose = () => {
    form.resetFields();
  };
  const onSubmit = () => {
    form.validateFields().then((resp) => {
      const { users } = resp;
      if (users) {
        setUsers(users.map((user) => JSON.parse(user)));
      }
      setVisible(false);
    });
  };

  return (
    <Modal
      centered
      visible={visible}
      width={'76.2%'}
      title="เพิ่มผู้ใช้งาน"
      style={{ marginTop: 20 }}
      onCancel={onCancel}
      afterClose={onAfterClose}
      footer={
        <Space className="gx-full-width gx-flex-end">
          <Button onClick={onCancel}>ยกเลิก</Button>
          <Button type="primary" onClick={onSubmit}>
            บันทึก
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item label="เลือกผู้ใช้งาน" name="users">
          <UserSelectWidget showSearch json mode="multiple" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default observer(AddUser);
