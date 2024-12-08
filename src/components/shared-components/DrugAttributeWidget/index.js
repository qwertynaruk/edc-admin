import { Checkbox, Col, Form, InputNumber, Select } from 'antd';
import _ from 'lodash';
import { observer } from 'mobx-react';
import AttributeStore from 'mobx/AttributeStore';
import { useState } from 'react';
import { SuffixCheckbox } from 'utils/style-js';

const { Option } = Select;

const DrugAttributeWidget = ({ form }) => {
  const [nameTypeStack, setNameTypeStack] = useState([]);
  const [unitStack, setUnitStack] = useState([]);

  const onChangeType = (el, handleChange = true) => {
    let nameTypeChild = [];
    const groupTypeId = _.get(
      _.find(AttributeStore.drug_group_type, (ss) => ss.name === el),
      '_id',
      ''
    );
    nameTypeChild = AttributeStore.drug_type.filter((ss) => ss.drug_group_type_id === groupTypeId);

    setNameTypeStack(nameTypeChild);

    if (handleChange) {
      form.setFieldsValue({
        name: null,
        unit: null,
      });
    }
  };

  const onChangeName = (el, handleChange = true) => {
    let unitChild = [];

    unitChild = _.get(
      _.find(AttributeStore.drug_type, (ss) => ss.name === el),
      'unit',
      []
    );

    setUnitStack(unitChild.map((ss) => ({ name: ss })));

    if (handleChange) {
      form.setFieldsValue({ unit: null });
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
          name="drug_type"
          label="ประเภทสิ่งเสพติด (ประเภท 1-5)"
          rules={[{ required: true, message: 'กรุณาเลือกประเภทสิ่งเสพติด' }]}
        >
          <Select showSearch placeholder="เลือกประเภทสิ่งเสพติด" onChange={onChangeType}>
            {renderOption(AttributeStore.drug_group_type)}
          </Select>
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item shouldUpdate>
          {({ getFieldValue }) => {
            const isDrugTypeSelected = getFieldValue('drug_type');
            return (
              <Form.Item
                name="name"
                label="ชื่อยาเสพติด"
                rules={[{ required: true, message: 'กรุณาเลือกชื่อยาเสพติด' }]}
              >
                <Select
                  showSearch
                  placeholder="เลือกชื่อยาเสพติด"
                  onChange={onChangeName}
                  disabled={!isDrugTypeSelected}
                >
                  {renderOption(nameTypeStack)}
                </Select>
              </Form.Item>
            );
          }}
        </Form.Item>
      </Col>

      <Col span={8}>
        <SuffixCheckbox>
          <Form.Item name="unknow_quantity" valuePropName="checked">
            <Checkbox onChange={onResetQuantityField}>ไม่ทราบจำนวน</Checkbox>
          </Form.Item>
        </SuffixCheckbox>
        <Form.Item label="จำนวน" shouldUpdate>
          {({ getFieldValue }) => (
            <Form.Item name="quantity">
              <InputNumber
                className="gx-w-100"
                type="number"
                min={0}
                disabled={getFieldValue('unknow_quantity')}
                placeholder="กรอกจำนวน"
              />
            </Form.Item>
          )}
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item shouldUpdate>
          {({ getFieldValue }) => {
            const isDrugNameSelected = getFieldValue('name');
            return (
              <Form.Item name="unit" label="หน่วย">
                <Select showSearch placeholder="เลือกหน่วย" disabled={!isDrugNameSelected}>
                  {renderOption(unitStack)}
                </Select>
              </Form.Item>
            );
          }}
        </Form.Item>
      </Col>
    </>
  );
};

export default observer(DrugAttributeWidget);
