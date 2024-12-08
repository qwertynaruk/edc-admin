import { Checkbox, Col, Form, InputNumber, Select } from 'antd';
import _ from 'lodash';
import { observer } from 'mobx-react';
import AttributeStore from 'mobx/AttributeStore';
import { useState } from 'react';
import { SuffixCheckbox } from 'utils/style-js';
import MasterSelectWidget from '../MasterSelectWidget';

const { Option } = Select;

const FirearmAttributeWidget = ({ form }) => {
  const [typeStack, setTypeStack] = useState([]);
  const [typeEnable, setTypeEnable] = useState(true);

  const onChangeCategory = (el, handleChange = true) => {
    let typeChild = [];
    const groupTypeId = _.get(
      _.find(AttributeStore.firearm_group_type, (ss) => ss.name === el),
      '_id',
      ''
    );
    typeChild = AttributeStore.firearm_type.filter((ss) => ss.weapon_group_type_id === groupTypeId);

    setTypeStack(typeChild);
    setTypeEnable(typeChild.length > 0);

    if (handleChange) {
      form.setFieldsValue({
        type: null,
      });
    }
  };

  const onResetQuantityField = (el) => {
    const _tx = _.get(el, 'target.checked', false) || false;

    if (_tx) {
      form.setFieldsValue({ quantity: null });
    }
  };

  const renderOption = (item) => {
    return item.map((el, _index) => (
      <Option key={_index} value={el.name}>
        {el.name}
      </Option>
    ));
  };

  return (
    <>
      <Col span={8}>
        <Form.Item
          name="category"
          label="ประเภท/ลักษณะอาวุธ"
          rules={[{ required: true, message: 'กรุณาเลือกประเภท/ลักษณะอาวุธ' }]}
        >
          <Select showSearch placeholder="เลือกประเภท/ลักษณะอาวุธ" onChange={onChangeCategory}>
            {renderOption(AttributeStore.firearm_group_type)}
          </Select>
        </Form.Item>
      </Col>

      {typeEnable && (
        <Col span={8}>
          <Form.Item name="type" label="ชนิดอาวุธ">
            <Select showSearch placeholder="เลือกชนิดอาวุธ">
              {renderOption(typeStack)}
            </Select>
          </Form.Item>
        </Col>
      )}

      <Col span={8}>
        <SuffixCheckbox>
          <Form.Item name="unknow_quantity" label="" valuePropName="checked">
            <Checkbox onChange={onResetQuantityField}>ไม่ทราบจำนวน</Checkbox>
          </Form.Item>
        </SuffixCheckbox>
        <Form.Item className="gx-mb-0" label="จำนวน" shouldUpdate>
          {() => (
            <Form.Item name="quantity">
              <InputNumber
                className="gx-w-100"
                type="number"
                min={0}
                disabled={form.getFieldValue('unknow_quantity')}
                placeholder="กรอกจำนวน"
              />
            </Form.Item>
          )}
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item name="unit" label="หน่วย">
          <MasterSelectWidget showSearch placeholder="เลือกหน่วย" category="11" />
        </Form.Item>
      </Col>
    </>
  );
};

export default observer(FirearmAttributeWidget);
