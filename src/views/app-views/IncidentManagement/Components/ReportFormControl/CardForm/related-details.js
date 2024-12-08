import { Button, Card, Form, Space, Typography } from 'antd';
import WYSISWYG from 'components/shared-components/WYSISWYG';

const { Text } = Typography;

const RelatedDetails = ({ iRef, reportId }) => {
  const [form] = Form.useForm();

  const finishForm = (values) => {
    console.log(values);
  };

  return (
    <Card ref={(el) => (iRef.current.more_details = el)}>
      <Text strong>รายละเอียดเพิ่มเติม</Text>

      <Form form={form} layout="vertical" onFinish={finishForm}>
        <div className="gx-my-4">
          <Form.Item name="more_detail_text" label="">
            <WYSISWYG
              isCard={false}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              toolbar={{
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
              }}
            />
          </Form.Item>
        </div>

        <Space className="gx-full-width gx-flex-end">
          <Button type="primary" onClick={() => form.submit()}>
            บันทึกข้อมูล
          </Button>
        </Space>
      </Form>
    </Card>
  );
};

export default RelatedDetails;
