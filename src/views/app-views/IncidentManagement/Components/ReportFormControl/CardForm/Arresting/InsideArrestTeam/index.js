import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import InputTextNumber from 'components/shared-components/InputTextNumber';
import PersonnelSelectWidget from 'components/shared-components/PersonnelSelectWidget';
import { MAX_API_LIMIT } from 'constants/ApiConstant';
import usePersonnel from 'hooks/services/usePersonnel';
import _ from 'lodash';

const InsideArrestTeam = ({ setEventChange = () => {}, form, fieldName = '', subFieldName = '' }) => {
  const { data: _personnel } = usePersonnel({
    params: {
      limit: MAX_API_LIMIT,
    },
  });

  const personelChange = (_target, _fieldName) => {
    const _there = _personnel?.find((ss) => ss._id === _target);
    const internalArrestUnit = form.getFieldValue(fieldName);

    const field = {
      ..._there,
      position: _.get(_there, 'position.name', '-'),
      department: _.get(_there, 'department.name', '-'),
      organization: _.get(_there, 'organization.name', '-'),
    };

    if (subFieldName) {
      internalArrestUnit.officer[_fieldName] = field;
    } else {
      internalArrestUnit[_fieldName] = field;
    }

    form.setFieldsValue({
      [fieldName]: internalArrestUnit,
    });

    setEventChange(true);
  };

  return (
    <Form.List data-testid={fieldName} name={subFieldName ? [fieldName, subFieldName] : fieldName}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Card key={key}>
              <Button className="gx-position-absolute" ghost onClick={() => remove(name)}>
                <DeleteOutlined />
              </Button>

              <Row className="gx-flex-row" gutter={[16, 16]}>
                <Col span={16}>
                  <Form.Item
                    {...restField}
                    name={[name, '_id']}
                    label={`เจ้าหน้าที่ (${name + 1})`}
                    rules={[{ required: true, message: 'กรุณาเลือกเจ้าหน้าที่' }]}
                  >
                    <PersonnelSelectWidget onChange={(ss) => personelChange(ss, name)} placeholder="เลือกเจ้าหน้าที่" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item {...restField} name={[name, 'phone_number']} label="เบอร์โทร">
                    <InputTextNumber />
                  </Form.Item>
                </Col>

                <Col span={4}>
                  <Form.Item {...restField} name={[name, 'position']} label="ตำแหน่ง">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={4}>
                  <Form.Item {...restField} name={[name, 'position_abbreviation']} label="ตัวย่อตำแหน่ง">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={4}>
                  <Form.Item {...restField} name={[name, 'department']} label="ฝ่ายงาน">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={4}>
                  <Form.Item {...restField} name={[name, 'department_abbreviation']} label="ตัวย่อฝ่ายงาน">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item {...restField} name={[name, 'organization']} label="สถานีตำรวจ">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          ))}
          <Button data-testid={`${fieldName}-button-add`} type="primary" onClick={() => add()}>
            เพิ่มเจ้าหน้าที่
          </Button>
        </>
      )}
    </Form.List>
  );
};

export default InsideArrestTeam;
