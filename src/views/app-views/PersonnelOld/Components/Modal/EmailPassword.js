import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row, Space, Typography } from 'antd';
import AlertErrorMessage from 'components/shared-components/AlertErrorMessage';
import DialogNotification from 'components/shared-components/DialogNotification';
import _ from 'lodash';
import { useContext, useState } from 'react';
import UserService from 'services/UserService';
import { PersonnelEditorContext } from '../PersonnelEditor';

const AT_LEAST_8_OR_99_CHARACTERS_PATTERN = {
  pattern: /^\S{8,99}$/,
  message: 'กรุณากรอกรหัสผ่านอย่างน้อย 8 ตัวอักษร',
};

const AT_LEAST_ONE_UPPERCASE_PATTERN = {
  pattern: /^(?=.*[A-Z]).+$/,
  message: 'ต้องมีอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว',
};

const AT_LEAST_ONE_LOWERCASE_PATTERN = {
  pattern: /^(?=.*[a-z]).+$/,
  message: 'ต้องมีอักษรพิมพ์เล็กอย่างน้อย 1 ตัว',
};

const AT_LEAST_ONE_NUMBER_PATTERN = {
  pattern: /^(?=.*[0-9]).+$/,
  message: 'ต้องมีตัวเลขอย่างน้อย 1 ตัว',
};

const AT_LEAST_ONE_SPECIAL_CHARACTER_PATTERN = {
  pattern: /^(?=.*[\^$*.∏[\]{}()?\-"!@#%&/,><':;|_~`]).+$/,
  message: 'ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว: ^ $ * . [ ] { } ( ) ? " ! @ # % & / \\ , > < \' : ; | _ ~ ` = + -',
};

const PasswordValidationListItem = (props) => {
  const { message, fieldName } = props;
  const { isFieldTouched, getFieldError, getFieldValue } = props.formInstance;
  const errors = getFieldError(fieldName);
  const touched = isFieldTouched(fieldName);
  const fieldValue = getFieldValue(fieldName);
  const hasError = errors.find((item) => item === message);
  const hasSuccess = touched && !hasError;
  const idle = !fieldValue;

  return (
    <Typography.Text type={idle ? '' : hasError ? 'danger' : hasSuccess ? 'success' : ''}>
      <Space>
        {idle && <InfoCircleOutlined />}
        {hasError && <CloseCircleOutlined />}
        {hasSuccess && !idle && <CheckCircleOutlined />}
        {message}
      </Space>
    </Typography.Text>
  );
};

const EmailPasswordModal = (props) => {
  const { personnel, getPersonnel } = useContext(PersonnelEditorContext);
  const { visible } = props;
  const [form] = Form.useForm();
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const onCancel = () => {
    form.resetFields();
    if (props.onCancel) props.onCancel();
  };
  const onSubmit = (values) => {
    const formValues = _.omit(values, ['password_confirmation']);
    setActionLoading(true);
    setErrorMessage(null);
    if (!personnel) {
      if (props.onSubmit) props.onSubmit(formValues);
      setActionLoading(false);
      return;
    }
    UserService.create({
      data: {
        ...formValues,
        first_name: personnel.first_name,
        middle_name: personnel.middle_name,
        last_name: personnel.last_name,
        phone_number: personnel.phone_number,
        line_id: personnel.line_id || '',
        prefix_name: personnel.prefix_name,
        person_card_id: personnel.person_card_id,
        cover_image_file: personnel.cover_image_file,
        s3_upload_key: personnel.s3_upload_key,
        role: 'police',
        is_active: true,
      },
    })
      .then(() => {
        DialogNotification('success', 'สร้างผู้ใช้งานเรียบร้อยแล้ว');
        if (props.onSubmit) props.onSubmit(formValues);
        if (getPersonnel) getPersonnel();
      })
      .catch((error) => {
        DialogNotification('error', 'สร้างผู้ใช้งานไม่สำเร็จ');
        setErrorMessage(error.body.message);
      })
      .finally(() => {
        setActionLoading(false);
      });
  };
  return (
    <Modal
      title="เพิ่มผู้ใช้งานในระบบ"
      visible={visible}
      onCancel={onCancel}
      destroyOnClose={true}
      footer={
        <Space direction="vertical" align="end">
          <Space>
            <Button onClick={onCancel}>ยกเลิก</Button>
            <Button type="primary" onClick={() => form.submit()} loading={actionLoading}>
              บันทึก
            </Button>
          </Space>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="กรอกอีเมลเข้าใช้งาน"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'กรุณากรอกอีเมล',
                },
                {
                  type: 'email',
                  message: 'กรุณากรอกอีเมลให้ถูกต้อง',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="กรอกรหัสผ่าน"
              name="password"
              help=""
              rules={[
                {
                  required: true,
                  message: 'กรุณากรอกรหัสผ่าน',
                },
                AT_LEAST_ONE_LOWERCASE_PATTERN,
                AT_LEAST_ONE_UPPERCASE_PATTERN,
                AT_LEAST_ONE_NUMBER_PATTERN,
                AT_LEAST_ONE_SPECIAL_CHARACTER_PATTERN,
                AT_LEAST_8_OR_99_CHARACTERS_PATTERN,
              ]}
            >
              <Input.Password maxLength={99} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="กรอกรหัสผ่านอีกครั้ง"
              name="password_confirmation"
              rules={[
                {
                  required: true,
                  message: 'กรุณากรอกรหัสผ่าน',
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('กรุณากรอกรหัสผ่านให้ตรงกัน'));
                  },
                }),
              ]}
            >
              <Input.Password maxLength={99} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item shouldUpdate>
              {(formInstance) => {
                return (
                  <>
                    <PasswordValidationListItem
                      formInstance={formInstance}
                      fieldName="password"
                      message={AT_LEAST_8_OR_99_CHARACTERS_PATTERN.message}
                    />
                    <PasswordValidationListItem
                      formInstance={formInstance}
                      fieldName="password"
                      message={AT_LEAST_ONE_UPPERCASE_PATTERN.message}
                    />
                    <PasswordValidationListItem
                      formInstance={formInstance}
                      fieldName="password"
                      message={AT_LEAST_ONE_LOWERCASE_PATTERN.message}
                    />
                    <PasswordValidationListItem
                      formInstance={formInstance}
                      fieldName="password"
                      message={AT_LEAST_ONE_NUMBER_PATTERN.message}
                    />
                    <PasswordValidationListItem
                      formInstance={formInstance}
                      fieldName="password"
                      message={AT_LEAST_ONE_SPECIAL_CHARACTER_PATTERN.message}
                    />
                  </>
                );
              }}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <AlertErrorMessage message={errorMessage} />
        </Row>
      </Form>
    </Modal>
  );
};

export default EmailPasswordModal;
