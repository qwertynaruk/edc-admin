import { DatePicker, Form, Modal } from 'antd';
import moment from 'moment';

export const CmsBannerPublishScheduleDialog = ({
  open,
  onClose,
  okButtonProps: { onClick, ...okButtonProps } = {},
}) => {
  const [form] = Form.useForm();

  const onOk = async () => {
    try {
      await form.validateFields();
      const schedule = form.getFieldValue('schedule');
      onClick(schedule);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal title="กำหนดวันเผยแพร่" visible={open} onCancel={onClose} okButtonProps={okButtonProps} onOk={onOk} centered>
      <Form name="schedule-form" form={form} layout="vertical">
        <Form.Item
          label="เลือกวันที่และเวลาที่ต้องการเผยแพร่"
          name="schedule"
          rules={[
            {
              required: true,
              message: 'กรุณาเลือกวันที่และเวลาที่ต้องการเผยแพร่',
            },
          ]}
        >
          <DatePicker
            showTime={{ format: 'HH:mm', minuteStep: 30 }}
            format="DD-MM-YYYY HH:mm:ss"
            className="gx-w-100 gx-mt-1"
            disabledDate={(current) => current && current < moment().startOf('day')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
