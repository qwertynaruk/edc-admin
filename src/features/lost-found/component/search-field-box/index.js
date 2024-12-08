import { Card, Form, Input, Space, Typography } from 'antd';

import { SearchOutlined } from '@ant-design/icons';

export function SearchFieldBox() {
  return (
    <Card style={{ marginBottom: 0 }}>
      <Form layout="vertical">
        <Form.Item label="ค้นหา" style={{ marginBottom: 0 }}>
          <Input.Search
            placeholder="ค้นหา..."
            enterButton={
              <Space>
                <SearchOutlined />
                <Typography.Text>ค้นหา</Typography.Text>
              </Space>
            }
          />
        </Form.Item>
      </Form>
    </Card>
  );
}
