import { Col, List, Row, Space, Switch, Typography } from 'antd';

import { notificationSettings } from './datas';

export function ProfilesNotification() {
  const ListComponent = ({ datas = undefined }) => {
    return (
      <List
        itemLayout="vertical"
        dataSource={datas}
        renderItem={(item, index) => (
          <List.Item key={index}>
            <Space style={{ padding: 15 }} direction="vertical" size={20}>
              <Row key={index} style={{ marginBottom: index >= item?.list?.length - 1 ? 0 : 15 }}>
                <Col xs={18}>
                  <Space direction="vertical" size={5}>
                    <Typography.Title level={5} style={{ marginBottom: 0 }}>
                      {item?.title}
                    </Typography.Title>
                    <Typography.Text style={{ color: '#ffffff60' }}>{item?.descriptions}</Typography.Text>
                  </Space>
                </Col>
                {!item?.list && (
                  <Col xs={6} style={{ textAlign: 'end' }}>
                    <Switch checkedChildren="ON" unCheckedChildren="OFF" defaultChecked />
                  </Col>
                )}
              </Row>
              {item?.list && item?.list?.length > 0 && (
                <div>
                  {item?.list?.map((ss, index) => (
                    <Row key={index} style={{ marginBottom: index >= item?.list?.length - 1 ? 0 : 15 }}>
                      <Col xs={18}>
                        <Space direction="vertical" size={5}>
                          <Typography.Title level={5} style={{ marginBottom: 0 }}>
                            {ss?.title}
                          </Typography.Title>
                          <Typography.Text style={{ color: '#ffffff60' }}>{ss?.descriptions}</Typography.Text>
                        </Space>
                      </Col>
                      <Col xs={6} style={{ textAlign: 'end' }}>
                        <Switch checkedChildren="ON" unCheckedChildren="OFF" defaultChecked />
                      </Col>
                    </Row>
                  ))}
                </div>
              )}
            </Space>
          </List.Item>
        )}
      />
    );
  };

  return (
    <div>
      <ListComponent datas={notificationSettings} />
    </div>
  );
}
