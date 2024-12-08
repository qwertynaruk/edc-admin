import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Form, Input, Radio } from 'antd';
import InputTextNumber from 'components/shared-components/InputTextNumber';

const modeForm = {
  email: {
    type: 'email',
    errorRequired: 'กรุณากรอกอีเมล',
    errorInvalid: 'กรุณากรอกอีเมลให้ถูกต้อง',
    input: <Input placeholder="กรอกอีเมล" prefix={<MailOutlined className="text-primary" />} />,
  },
  phone_number: {
    type: '',
    errorRequired: 'กรุณากรอกเบอร์โทร',
    errorInvalid: 'กรุณากรอกเบอร์โทรให้ถูกต้อง',
    input: (
      <InputTextNumber maxLength={10} placeholder="กรอกเบอร์โทร" prefix={<PhoneOutlined className="text-primary" />} />
    ),
  },
};

const FormForgotPage = (props) => {
  const { form, alertStatus = { showMessage: false, message: '' } } = props;
  const { showMessage = false, message = '' } = alertStatus;
  return (
    <>
      {/* <motion.div
        initial={{ opacity: 0, marginBottom: 0 }}
        className="gx-mt-2"
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
      <Form.Item name="mode" className="gx-mb-2">
        <Radio.Group>
          <Radio value="email">อีเมล</Radio>
          <Radio value="phone_number">เบอร์โทร</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item shouldUpdate>
        {({ getFieldValue }) => {
          const mode = getFieldValue(['mode']);
          return (
            <Form.Item
              name={mode}
              validateTrigger={false}
              rules={[
                {
                  required: true,
                  message: modeForm[mode]?.errorRequired,
                },
                {
                  type: modeForm[mode]?.type,
                  message: modeForm[mode]?.errorInvalid,
                },
              ]}
            >
              {modeForm[mode]?.input}
            </Form.Item>
          );
        }}
      </Form.Item>
    </>
  );
};

export default FormForgotPage;
