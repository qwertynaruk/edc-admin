import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Row, Select, Typography } from 'antd';

import UserSelectWidget from 'components/shared-components/UserSelectWidget';
import Flex from 'components/shared-components/Flex';
const { Title } = Typography;
const { Option } = Select;

const OfficerList = (props) => {
  const { fields = [], add = () => {}, remove = () => {}, form } = props;
  const button = {
    onClick() {
      return add();
    },
  };
  const iconDelete = {
    onClick(name) {
      if (fields.length === 1) return;
      return remove(name);
    },
  };
  return (
    <>
      <Card>
        <Row className="gx-flex-row" gutter={[16, 16]}>
          <Col span="24">
            <Flex justifyContent="between" alignItems="center">
              <span>
                <Title level={4} className="gx-mb-0">
                  รายชื่อเจ้าหน้าที่ทีมปฏิบัติการ
                </Title>
              </span>
            </Flex>
          </Col>
          <Col span="24" className="gx-p-0">
            {fields.map(({ key, name, ...restField }, index) => {
              return (
                <Card
                  key={key}
                  bodyStyle={{ padding: '0 0 24px 0' }}
                  className={`${fields.length === index + 1 ? 'gx-mb-0' : ''}`}
                >
                  <Flex justifyContent="end" alignItems="center">
                    <DeleteOutlined
                      style={{ cursor: 'pointer' }}
                      className="gx-pr-2 gx-pt-2"
                      onClick={() => iconDelete.onClick(name)}
                    />
                  </Flex>
                  <GenerateForm name={name} index={index} form={form} />
                </Card>
              );
            })}
          </Col>
          <Col span={7}>
            <Button type="primary" className="gx-w-100" onClick={button.onClick}>
              เพิ่มเจ้าหน้าที่
            </Button>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default OfficerList;

const GenerateForm = (props) => {
  const { form, index } = props;

  return (
    <Row className="gx-flex-row">
      <Col span="8">
        <Form.Item className="gx-mb-0" label={`ผู้รับผิดชอบ ${index + 1}`} name={index}>
          <UserSelectWidget defualtValue={form.getFieldValue('operation_officers')} placeholder="เลือกผู้รับผิดชอบ" />
        </Form.Item>
      </Col>
    </Row>
  );
};
