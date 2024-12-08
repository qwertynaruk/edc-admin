import { Card, Col, Form, Row, Select, Typography } from 'antd';
import PersonnelSelectWidget from 'components/shared-components/PersonnelSelectWidget';
const { Title } = Typography;
const { Option } = Select;

const TeamResponsibility = (props) => {
  // const arrayPosition = ["เจ้าหน้าที่", "ผู้รับผิดชอบหลัก", "หัวหน้าทีม"];
  return (
    <>
      <Card>
        <Row className="gx-flex-row" gutter={[16, 24]}>
          <Col span="24">
            <Title level={4} className="gx-mb-0">
              หน้าที่ความรับผิดชอบภายในชุดปฏิบัติการ
            </Title>
          </Col>

          <Card style={{ width: '100%' }}>
            <Col span={10}>
              <Form.Item
                label="หัวหน้าชุด/ผู้รับผิดชอบ"
                name={['team_within', 'leader']}
                rules={[
                  {
                    required: true,
                    message: 'กรุณาเลือกหัวหน้าชุด/ผู้รับผิดชอบ',
                  },
                ]}
              >
                <PersonnelSelectWidget placeholder="กรุณาเลือกหัวหน้าชุด/ผู้รับผิดชอบ" />
              </Form.Item>

              {/* <Form.Item
                label="ผู้รับผิดชอบหลัก"
                name={["team_within", "main_responsible"]}
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกผู้รับผิดชอบหลัก",
                  },
                ]}
              > */}
              {/* <Select placeholder="เลือกประเภทของหน่วยงานหลัก">
                  {arrayPosition.map((name) => (
                    <Option value={name}></Option>
                  ))}
                </Select> */}
              {/* <UserSelectWidget placeholder="กรุณาระบุผู้รับผิดชอบหลัก" /> */}
              {/* </Form.Item> */}
            </Col>
          </Card>
        </Row>
      </Card>
    </>
  );
};

export default TeamResponsibility;
