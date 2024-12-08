import { DatePicker, Form, Modal } from 'antd';
import { useEffect, useState } from 'react';

import DatePickerISOHoC from 'components/shared-components/DatePickerISOHoC';
import DialogNotification from 'components/shared-components/DialogNotification';
import { useUpdateMassNotification } from 'features/mass-notification/hooks/use-update-mass-notification';

export function PublishScheduleModal({
  items = '',
  open = false,
  setOpen = undefined,
  methods = 'update',
  onSuccess = undefined,
  loading = false,
}) {
  const [btnLoading, setBtnLoading] = useState(false);
  const [form] = Form.useForm();
  const { mutate } = useUpdateMassNotification({
    onSuccess: () => {
      DialogNotification('success', 'แก้ไขรายการสำเร็จ');
      onClose();
      setBtnLoading(false);
    },
    onError: () => {
      DialogNotification('error', 'ไม่สามารถแก้รายการนี้ได้');
      setBtnLoading(false);
    },
  });

  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  const disabledDate = (current) => {
    const dx = new Date();
    dx.setDate(dx.getDate() - 1);
    // const m = current && current < dayjs().endOf('day');
    const m = current && current < dx;
    return m;
  };
  const disabledDateTime = () => {
    const dd = new Date();
    return {
      disabledHours: () => range(0, 24).filter((ss) => ss < dd.getHours()),
      disabledMinutes: () => range(0, 60).filter((ss) => ss <= dd.getMinutes()),
    };
  };

  const onClose = () => {
    form.resetFields();
    setOpen(false);
  };

  const onFinish = (values) => {
    setBtnLoading(true);
    if (methods === 'update') {
      mutate({
        payload: values,
        params: {
          id: items.id,
        },
      });
    } else {
      onSuccess?.(values);
    }
  };

  const onSubmit = () => {
    form.submit();
  };

  useEffect(() => setBtnLoading(loading), [loading]);

  useEffect(() => {
    if (open && methods === 'update') {
      form.setFieldsValue({
        publish_time: items.publish_time,
      });
    }
  }, [open]);

  return (
    <Modal
      visible={open}
      title="กำหนดเผยแพร่"
      okButtonProps={{
        title: 'บันทึก',
        onClick: onSubmit,
        loading: btnLoading,
      }}
      cancelButtonProps={{
        title: 'ยกเลิก',
        onClick: () => onClose(),
      }}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="publish_time"
          label="เลือกวันที่และเวลาที่ต้องการเผยแพร่"
          rules={[
            {
              required: true,
              message: 'กรุณาเลือกวันที่และเวลาที่ต้องการเผยแพร่',
            },
          ]}
        >
          <DatePickerISOHoC>
            <DatePicker
              showNow={false}
              disabledDate={disabledDate}
              disabledTime={disabledDateTime}
              showTime={{ format: 'HH:mm' }}
              style={{ width: '100%' }}
              placeholder="เลือกวันที่"
            />
          </DatePickerISOHoC>
        </Form.Item>
      </Form>
    </Modal>
  );
}
