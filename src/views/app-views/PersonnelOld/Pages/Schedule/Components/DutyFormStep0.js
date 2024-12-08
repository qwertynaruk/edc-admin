import { Button, Card, Divider, Form, Input, Space } from 'antd';
import { useContext, useEffect } from 'react';
import AgenciesForm from './AgenciesForm';
import BasicForm from './BasicForm';
import { DutyFormContext } from './DutyForm';

const DutyFormStep0 = (props) => {
  const [form] = Form.useForm();
  const { person = false, record } = useContext(DutyFormContext);

  useEffect(() => {
    if (!record) return;
    form.setFieldsValue(record);
  }, [form, record]);

  return (
    <Form form={form} name="step0" layout="vertical">
      <Card title="สร้างตารางปฏิบัติหน้าที่">
        <Form.Item name="duty_id" noStyle hidden>
          <Input type="hidden" />
        </Form.Item>
        <BasicForm />
        {!person && <AgenciesForm />}
        <Divider />
        <Space className="gx-justify-content-end">
          <Space>
            <Button onClick={props.onCancel}>ยกเลิก</Button>
            <Button type="primary" htmlType="submit">
              ถัดไป
            </Button>
          </Space>
        </Space>
      </Card>
    </Form>
  );
};

export default DutyFormStep0;
