import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Space, Typography } from 'antd';

const OutsideArrestTeam = () => {
  const OfficerAppend = ({ masterName }) => {
    return (
      <Form.List name={masterName}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Form.Item {...restField} key={key} name={[name, 'name']} label={`เจ้าหน้าที่ (${name + 1})`}>
                <Input
                  placeholder="กรอกชื่อเจ้าหน้าที่"
                  addonAfter={
                    <Button ghost onClick={() => remove(name)}>
                      <DeleteOutlined />
                    </Button>
                  }
                />
              </Form.Item>
            ))}
            <Button data-testid="outside-arrest-team-button-add" type="primary" onClick={() => add()}>
              เพิ่มเจ้าหน้าที่
            </Button>
          </>
        )}
      </Form.List>
    );
  };

  const formListName = 'external_arrest_unit';

  return (
    <Form.List name={formListName}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Card key={key}>
              <Space align="center" className="gx-space-between gx-mb-4">
                <Typography.Text strong>ชุดจับกุม ({name + 1})</Typography.Text>
                <Button ghost onClick={() => remove(name)}>
                  <DeleteOutlined />
                </Button>
              </Space>

              <Space direction="vertical">
                <Form.Item {...restField} name={[name, 'organization_name']} label="ชื่อหน่วยงาน">
                  <Input placeholder="กรอกชื่อหน่วยงาน" />
                </Form.Item>

                <OfficerAppend masterName={[name, 'officer']} />
              </Space>
            </Card>
          ))}
          <Button data-testid={`${formListName}-button-add`} type="primary" onClick={() => add()}>
            เพิ่มชุดจับกุม
          </Button>
        </>
      )}
    </Form.List>
  );
};

export default OutsideArrestTeam;
