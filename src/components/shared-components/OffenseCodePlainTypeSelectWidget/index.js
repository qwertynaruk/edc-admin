import { Col, Form } from 'antd';
import _ from 'lodash';
import { observer } from 'mobx-react';
import ReportStore from 'mobx/ReportStore';
import { useEffect, useMemo, useState } from 'react';
import CustomSelect from '../CustomSelect';

const OffenseCodePlainTypeSelectWidget = ({ form, fieldName, required = true, multiple = false, disabled = false }) => {
  const { offenseCodeType = [] } = ReportStore;
  const [plaintOptions, setPlaintOptions] = useState([]);

  const options = useMemo(() => {
    return offenseCodeType.map((item) => {
      return {
        label: item.name,
        value: item.name,
      };
    });
  }, [offenseCodeType]);

  const onChangeOption = (values) => {
    if (multiple) {
      setPlaintOptions(
        offenseCodeType
          .filter((n) => values.includes(n.name))
          .flatMap((n) => {
            return n.sub_types.map((ss) => ({ label: ss, value: ss }));
          })
      );
      return;
    }
    setPlaintOptions(
      _.get(
        _.find(offenseCodeType, (n) => n.name === values),
        'sub_types',
        []
      ).map((ss) => ({
        label: ss,
        value: ss,
      }))
    );
  };

  useEffect(() => {
    ReportStore.getOffenseCodeType();
  }, []);

  useEffect(() => {
    if (form.getFieldValue('offense_type')) {
      onChangeOption(form.getFieldValue('offense_type'));
    }
  }, []);

  const mode = multiple ? 'multiple' : 'default';

  const getName = (name) => {
    if (Array.isArray(fieldName)) {
      return `${fieldName[0]}.${name}`;
    }
    return fieldName ? [fieldName, name] : name;
  };

  return (
    <>
      <Col span={8}>
        <Form.Item
          name={getName('offense_type')}
          label="กลุ่มคดี"
          rules={[{ required, message: 'กรุณาเลือกกลุ่มคดี' }]}
        >
          <CustomSelect
            onChange={onChangeOption}
            placeholder="เลือกกลุ่มคดี"
            options={options}
            mode={mode}
            disabled={disabled}
          />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item name={getName('plaint')} label="ข้อหา" rules={[{ required, message: 'กรุณาเลือกข้อหา' }]}>
          <CustomSelect placeholder="เลือกข้อหา" options={plaintOptions} mode={mode} disabled={disabled} />
        </Form.Item>
      </Col>
    </>
  );
};

export default observer(OffenseCodePlainTypeSelectWidget);
