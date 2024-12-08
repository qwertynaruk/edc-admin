import { Checkbox, Form, Spin } from 'antd';
import GisStore from 'mobx/GisStore';
import { useState } from 'react';

const FormCheckBox = ({ type = 'incident' }) => {
  const [form] = Form.useForm();
  const [loadingIncident, setLoadingIncident] = useState(false);

  const handleValuesChange = (values) => {
    const { checkChange = [] } = values;

    if (checkChange.length < 1) {
      GisStore.setGeoCodeIncidentList([]);
      GisStore.setGeoCodeOndutyList([]);
      return;
    }

    setLoadingIncident(true);

    const typeTh = {
      incident: 'แจ้งเบาะแส',
      onduty: 'รายงานการปฏิบัติหน้าที่',
    };

    form.resetFields();

    GisStore.getIncidenceMarker(typeTh[type], checkChange.toString()).finally(() => {
      setLoadingIncident(false);
      form.setFieldsValue({ checkChange: checkChange[checkChange.length - 1] });
    });
  };

  return (
    <Spin spinning={loadingIncident}>
      <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
        <Form.Item name="checkChange">
          <Checkbox.Group
            options={[
              { value: '1m', label: 'ย้อนหลัง 1 เดือน' },
              { value: '3m', label: 'ย้อนหลัง 3 เดือน' },
              { value: '6m', label: 'ย้อนหลัง 6 เดือน' },
              { value: '1y', label: 'ย้อนหลัง 1 ปี' },
            ]}
            style={{ display: 'flex', flexDirection: 'column', lineHeight: 2 }}
          />
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default FormCheckBox;
