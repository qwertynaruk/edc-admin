import { Card, Col, Menu, Row, Space, Typography } from 'antd';

import { ProfilesInformation } from '../profiles-information';
import { ProfilesNotification } from '../profiles-notification';
import { ProfilesRoles } from '../profiles-roles';
import { ProfilesSecurity } from '../profiles-security';
import { UserOutlined } from '@ant-design/icons';
import useDimension from 'hooks/useDimension';
import { useState } from 'react';

const menuItems = [
  {
    label: 'โปรไฟล์',
    key: 'information',
  },
  {
    label: 'ความปลอดภัย',
    key: 'security',
  },
  {
    label: 'การแจ้งเตือน',
    key: 'notification',
  },
  // {
  //   label: 'สิทธิ์การเข้าถึง',
  //   key: 'permission',
  // },
];

export function ProfilesPages() {
  const { height } = useDimension();
  const [current, setCurrent] = useState('information');

  const cardHeight = height - 200;
  const cardHeaderHeight = 50;
  const cardContentHeight = cardHeight - cardHeaderHeight - 2;

  const onMenuClick = (e) => {
    setCurrent(e?.key);
  };

  return (
    <Card style={{ borderColor: '#000', height: cardHeight }} bodyStyle={{ padding: 0 }}>
      <Row gutter={[0, 0]}>
        <Col
          xs={24}
          md={5}
          style={{ borderRightColor: '#000', borderRightWidth: 1, borderRightStyle: 'solid', paddingRight: 0 }}
        >
          <div style={{ height: cardHeaderHeight }}>
            <Space
              direction="vertical"
              align="center"
              style={{ height: cardHeaderHeight, paddingRight: 0, justifyContent: 'center' }}
            >
              <Space direction="horizontal" align="center">
                <Space
                  direction="vertical"
                  align="center"
                  style={{ border: '1px solid #fff', borderRadius: 3, width: 20 }}
                >
                  <UserOutlined />
                </Space>
                <Typography.Title level={5} style={{ marginBottom: 0 }}>
                  Profile
                </Typography.Title>
              </Space>
            </Space>
          </div>

          <div style={{ height: cardContentHeight, borderTop: '1px solid #000', paddingTop: 15 }}>
            <Space direction="vertical" align="start" style={{ height: cardContentHeight }}>
              <Menu
                onClick={onMenuClick}
                style={{
                  width: 256,
                }}
                defaultSelectedKeys={[current]}
                mode="inline"
                items={menuItems}
              />
            </Space>
          </div>
        </Col>
        <Col xs={24} md={19} style={{ paddingLeft: 0 }}>
          <div style={{ height: cardHeaderHeight }}>
            <Space style={{ height: cardHeaderHeight, paddingleft: 0 }}></Space>
          </div>

          <div style={{ height: cardContentHeight, borderTop: '1px solid #000' }}>
            <div style={{ height: cardContentHeight, overflow: 'scroll' }}>
              {current === 'information' && <ProfilesInformation />}
              {current === 'security' && <ProfilesSecurity />}
              {current === 'notification' && <ProfilesNotification />}
              {current === 'permission' && <ProfilesRoles />}
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
