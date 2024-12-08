import { Form, Modal, Select } from 'antd';

export const SubmitWorkDialog = ({ open, onClose }) => {
  return (
    <Modal title="ส่งงานต่อ" visible={open} onCancel={onClose} centered>
      <Form layout="vertical">
        <Form.Item label="เลือกหน่วยงาน" name="department" rules={[{ required: true, message: 'กรุณาเลือกหน่วยงาน' }]}>
          <Select />
        </Form.Item>
      </Form>
    </Modal>
  );
};
