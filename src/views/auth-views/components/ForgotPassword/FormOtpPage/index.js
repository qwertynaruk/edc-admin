import { LockOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';

const FormOtpPage = (props) => {
  const { alertStatus = { showMessage: false, message: '' } } = props;
  const { showMessage = false, message = '' } = alertStatus;
  const formEvent = {
    onCancel() {},
  };
  return (
    <>
      {/* <motion.div
        initial={{ opacity: 0, marginBottom: 0 }}
        className="mt-2"
        animate={{
          opacity: showMessage ? 1 : 0,
          marginBottom: showMessage ? 20 : 0,
        }}
      >
        <Alert
          // type={false ? "success" : "error"}
          type={"error"}
          showIcon
          message={message}
        ></Alert>
      </motion.div> */}

      <Form.Item label="กรอกรหัส OTP" name="code">
        <Input placeholder="กรอกรหัส OTP" prefix={<LockOutlined />} />
      </Form.Item>
    </>
  );
};

export default FormOtpPage;
