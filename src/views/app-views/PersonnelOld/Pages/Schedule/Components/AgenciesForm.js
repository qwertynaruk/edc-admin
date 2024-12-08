import { DeleteOutlined } from '@ant-design/icons';
import { Space as AntSpace, Button, Card, Col, Form, Row, Typography } from 'antd';
import TeamSelectWidget from 'components/shared-components/TeamSelectWidget';
import styled from '@emotion/styled';

const { Title } = Typography;

const Space = styled(AntSpace)`
  .ant-space-item:first-child {
    flex: 1;
  }
`;

const AgenciesForm = () => {
  return (
    <>
      <Title level={5}>ชุดปฏิบัติการ</Title>
      <Card>
        <Row gutter={16} className="gx-flex-row">
          <Col span={16}>
            <Form.List
              name="agencies"
              initialValue={[undefined]}
              help="เลือกชุดปฏิบัติการ"
              rules={[
                {
                  validator: async (_, names) => {
                    if (!names || names.length < 1 || typeof names[0] !== 'string') {
                      return Promise.reject(new Error('กรุณาเลือกอย่างน้อย 1 ชุดปฏิบัติการ'));
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, _) => (
                    <Space key={field.key}>
                      <Form.Item shouldUpdate noStyle>
                        {({ getFieldValue }) => {
                          const selectedAgency = getFieldValue('investigate_department');
                          const agencies = getFieldValue('agencies').filter((item) => typeof item === 'string');
                          return (
                            <Form.Item
                              {...field}
                              label="เลือกชุดปฏิบัติการ"
                              rules={[
                                {
                                  required: true,
                                  message: 'กรุณาเลือกชุดปฏิบัติการ',
                                },
                              ]}
                            >
                              <TeamSelectWidget agency={selectedAgency} disableItems={agencies} />
                            </Form.Item>
                          );
                        }}
                      </Form.Item>
                      <DeleteOutlined
                        onClick={() => remove(field.name)}
                        style={{ visibility: fields.length === 1 ? 'hidden' : 'visible' }}
                      />
                    </Space>
                  ))}
                  <Button type="primary" onClick={() => add()}>
                    เพิ่ม
                  </Button>
                </>
              )}
            </Form.List>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default AgenciesForm;
