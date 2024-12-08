import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import { Col, Form, Select } from 'antd';
import VehicleModelStore from 'mobx/VehicleModelStore';

const { Option } = Select;

export const otherBrand = {
  vehicle_make_id: 'OTHER',
  vehicle_make_name: 'อื่น ๆ',
  _id: '62ac1e1af28258a6904b0000',
};

export const otherModel = {
  _id: '62ac1dc8f28258a6904b000x',
  vehicle_model_code: 'OTHER_MODEL',
  vehicle_model_name: 'อื่น ๆ',
  vehicle_make_id: 'OTHER',
};

const VehicleMultipleModelWidget = ({ form, disabled = false }) => {
  const { brand_item = [], modelListitem = [] } = VehicleModelStore;
  const [brandLoading, setBrandLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);

  useEffect(() => {
    setBrandLoading(true);
    VehicleModelStore.GetBrand().finally(() => setBrandLoading(false));
  }, []);

  const onChangeBrand = (el) => {
    setModelLoading(true);
    VehicleModelStore.GetMultipleModel(el).finally(() => setModelLoading(false));

    form.setFieldsValue({
      model: undefined,
      unknown_model: false,
    });
  };

  const renderOption = (item, fieldName) => {
    return item.map((el, _index) => (
      <Option key={_index} value={el[fieldName]}>
        {el[fieldName]}
      </Option>
    ));
  };

  return (
    <>
      <Col span={8}>
        <Form.Item label="ยี่ห้อ" shouldUpdate>
          {() => (
            <Form.Item name="brand" className="gx-mb-0">
              <Select
                loading={brandLoading}
                showSearch
                placeholder="เลือกยี่ห้อ"
                onChange={onChangeBrand}
                disabled={form.getFieldValue('unknown_brand') || disabled}
                mode="tags"
                tokenSeparators={[',']}
              >
                {renderOption(brand_item, 'vehicle_make_name')}
                <Option value={otherBrand.vehicle_make_name}>{otherBrand.vehicle_make_name}</Option>
              </Select>
            </Form.Item>
          )}
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item label="รุ่น" shouldUpdate>
          {() => (
            <Form.Item name="model" className="gx-mb-0">
              <Select
                loading={modelLoading}
                showSearch
                placeholder="เลือกรุ่น"
                disabled={form.getFieldValue('unknown_model') || disabled}
                mode="tags"
                tokenSeparators={[',']}
              >
                {renderOption(modelListitem, 'vehicle_model_name')}
                <Option value={otherModel.vehicle_model_name}>{otherModel.vehicle_model_name}</Option>
              </Select>
            </Form.Item>
          )}
        </Form.Item>
      </Col>
    </>
  );
};

export default observer(VehicleMultipleModelWidget);
