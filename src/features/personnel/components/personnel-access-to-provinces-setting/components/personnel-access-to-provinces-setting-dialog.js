import { Form, Modal, Select } from 'antd';

import { FallbackError } from 'components/util-components/fallback-error';

import { useGetPersonnelMeta } from '../../../api/get-personnel-meta';

export const PersonnelAccessToProvincesSettingDialog = ({ open, onClose, onFinish, selected = [] }) => {
  const [form] = Form.useForm();

  const { data, isLoading, isError } = useGetPersonnelMeta({
    metaType: 'province_info',
  });

  const handleFinish = async () => {
    try {
      await form.validateFields();
      const provinceId = form.getFieldValue('province_id');
      onFinish?.(provinceId);
    } catch (error) {
      console.error(error);
    }
  };

  const provinceOptions = data?.data?.map((province) => ({
    label: province?.full_name_th,
    value: province?.id,
    disabled: selected.includes(province?.id),
  }));

  return (
    <Modal
      title="ตั้งค่าการเข้าถึงจังหวัด"
      visible={open}
      onCancel={onClose}
      onOk={handleFinish}
      centered
      afterClose={() => {
        form.resetFields();
      }}
    >
      {isError ? (
        <FallbackError />
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item
            label="จังหวัด"
            name="province_id"
            rules={[
              {
                required: true,
                message: 'กรุณาเลือกจังหวัด',
              },
            ]}
          >
            <Select
              loading={isLoading}
              value={isLoading ? 'กำลังโหลด...' : undefined}
              disabled={isLoading}
              showSearch
              filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              options={provinceOptions}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};
