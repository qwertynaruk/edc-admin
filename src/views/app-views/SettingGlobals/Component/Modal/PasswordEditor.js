import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { rules } from 'mobx/UserStore';

const PasswordEditor = (props) => {
  const { visible, isActionLoading = false } = props;
  const [form] = Form.useForm();
  const onSubmit = (values) => {
    if (props.onSubmit) props.onSubmit(values);
  };
  const onCancel = () => {
    if (props.onCancel) props.onCancel();
    form.resetFields();
  };
  return (
    <Modal visible={visible} footer={null} title="รีเซ็ตรหัสผ่าน" onCancel={onCancel}>
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item label="รหัสผ่าน" name="password" rules={rules.password}>
          <Input.Password placeholder="กรอกรหัสผ่าน" />
        </Form.Item>
        <Form.Item label="ยืนยันรหัสผ่าน" name="password_confirmation" rules={rules.passwordConfirm}>
          <Input.Password placeholder="กรอกรหัสผ่านอีกครั้ง" />
        </Form.Item>
        <Row>
          <Col align={'end'} span={24} style={{ padding: 0 }}>
            <Button onClick={onCancel}>ยกเลิก</Button>
            <Button type="primary" htmlType="submit" loading={isActionLoading}>
              บันทึก
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default PasswordEditor;
