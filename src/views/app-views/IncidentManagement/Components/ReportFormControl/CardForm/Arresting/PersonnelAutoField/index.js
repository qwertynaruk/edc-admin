import { Col, Form, Row } from 'antd';
import InputTextNumber from 'components/shared-components/InputTextNumber';
import PersonnelSelectWidget from 'components/shared-components/PersonnelSelectWidget';
import { MAX_API_LIMIT } from 'constants/ApiConstant';
import usePersonnel from 'hooks/services/usePersonnel';

const PersonnelAutoField = ({ setEventChange = () => {}, form, fieldName = '' }) => {
  const { data: _personnel } = usePersonnel({
    params: {
      limit: MAX_API_LIMIT,
    },
  });

  const personelChange = (_target) => {
    const _there = _personnel?.find((ss) => ss._id === _target);

    form.setFieldsValue({
      [fieldName]: _there,
    });

    setEventChange(true);
  };

  return (
    <Row className="gx-mt-4 gx-flex-row" gutter={[16, 16]}>
      <Col span={16}>
        <Form.Item
          name={[fieldName, '_id']}
          label="เจ้าหน้าที่"
          rules={[{ required: true, message: 'กรุณาเลือกเจ้าหน้าที่' }]}
        >
          <PersonnelSelectWidget onChange={(ss) => personelChange(ss)} placeholder="เลือกเจ้าหน้าที่" />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          name={[fieldName, 'phone_number']}
          label="เบอร์โทร"
          rules={[{ required: true, message: 'กรุณากรอกเบอร์โทร' }]}
        >
          <InputTextNumber />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default PersonnelAutoField;
