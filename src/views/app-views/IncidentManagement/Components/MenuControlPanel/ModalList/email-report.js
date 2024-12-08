import { Button, Form, Input, Modal, Select, Spin } from 'antd';
import PersonnelSelectWidget from 'components/shared-components/PersonnelSelectWidget';
import ReportStore from 'mobx/ReportStore';
import { useState } from 'react';

const { Option } = Select;

const EmailReport = ({ visible, setVisible }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinishForm = (values) => {
    const { email = [], description } = values;
    setLoading(true);
    ReportStore.createDirectEmail({
      user_id: email,
      description,
    })
      .then(() => onExitModal())
      .finally(() => setLoading(false));
  };

  const onExitModal = () => {
    setVisible(false);
    form.resetFields();
  };

  return (
    <Modal
      title="ส่งรายงานผ่านอีเมล"
      width={860}
      forceRender
      visible={visible}
      onCancel={onExitModal}
      footer={
        <Button loading={loading} type="primary" onClick={() => form.submit()}>
          ส่ง
        </Button>
      }
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={onFinishForm}>
          {/* <Form.Item label="ประเภทผู้รับ" name="type" rules={[{ required: true, message: 'กรุณาเลือกประเภทผู้รับ' }]}>
            <Select placeholder="เลือกประเภทผู้รับ">
              <Option value="ภายในองค์กร">ภายในองค์กร</Option>
              <Option value="ภายนอกองค์กร">ภายนอกองค์กร</Option>
            </Select>
          </Form.Item> */}

          {/* <Form.Item shouldUpdate>
            {() => (
              <Form.Item label="อีเมลผู้รับ" name="email" rules={[{ required: true, message: 'กรุณาระบุอีเมลผู้รับ' }]}>
                {form.getFieldValue('type') === 'ภายในองค์กร' ? (
                  <PersonnelSelectWidget placeholder="เลือกผู้ใช้งาน" mode="multiple" />
                ) : (
                  <Input placeholder="กรอกอีเมล" />
                )}
              </Form.Item>
            )}
          </Form.Item> */}

          <Form.Item shouldUpdate>
            {() => (
              <Form.Item label="ผู้รับ" name="email" rules={[{ required: true, message: 'ผู้รับ' }]}>
                <PersonnelSelectWidget placeholder="เลือกผู้ใช้งาน" mode="multiple" />
              </Form.Item>
            )}
          </Form.Item>

          <Form.Item label="รายละเอียด" name="description">
            <Input.TextArea></Input.TextArea>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EmailReport;
