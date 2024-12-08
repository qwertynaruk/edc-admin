import { Col, Form, Input, Modal, Row, message } from 'antd';

import { pick } from 'lodash';
import { useEffect } from 'react';
import useOneforce from 'hooks/use-oneforce';
import { useUpdatePersonnel } from 'features/personnel';

export function ProfilesAuthenModal({ items, open, setOpen }) {
  const [form] = Form.useForm();
  const { validateFieldsInput } = useOneforce({ form });
  const updatePersonnel = useUpdatePersonnel({
    personnelId: items?.personnel_id,
    onSuccess: () => {
      message.success('แก้ไขข้อมูลสำเร็จ');
      setOpen(false);
    },
    onError: () => {
      message.error('ไม่สามารถแก้ไขข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    },
  });

  const onFinish = (values) => {
    const payload = {
      ...pick(items, [
        'prefix_name',
        'first_name',
        'last_name',
        'prefix_name_th',
        'first_name_th',
        'last_name_th',
        'prefix_name_en',
        'first_name_en',
        'last_name_en',
        'image_url',
        'person_card_id',
      ]),
      ...values,
    };
    updatePersonnel.submit(payload);
  };

  const onCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  useEffect(() => {
    if (open && items) {
      form.setFieldsValue(items);
    }
  }, [open, items]);

  return (
    <Modal
      width={600}
      visible={open}
      title="แก้ไขข้อมูลเข้าสู่ระบบ"
      okButtonProps={{
        title: 'บันทึก',
        onClick: () => form.submit(),
        loading: updatePersonnel.isLoading,
      }}
      cancelButtonProps={{
        onClick: () => onCancel(),
        loading: updatePersonnel.isLoading,
      }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row>
          <Col xs={24}>
            <Form.Item
              label="เบอร์โทร"
              name="phone_number"
              rules={[
                {
                  required: true,
                  message: 'กรุณากรอกเบอร์โทร',
                },
                {
                  pattern: /^0[0-9]{8,9}$/,
                  message: 'กรุณากรอกเบอร์โทรให้ถูกต้อง',
                },
              ]}
            >
              <Input
                allowClear
                parser={(value) => {
                  return value.substring(0, 2);
                }}
                placeholder="กรอกเบอร์โทร"
                onKeyDown={(event) => validateFieldsInput(event)}
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="อีเมล"
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
              <Input placeholder="กรอกอีเมล" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
