import { Card, Col, Form, Input, Row, Select, Tabs, Typography } from 'antd';

import { css } from '@emotion/css';
import { useState } from 'react';

export const MassNotificationSearchFilter = ({
  currentTab = 'citizen',
  onTabChange,
  onSeachChange = () => undefined,
}) => {
  const [isAdvancedFilterVisible, setAdvancedFilterVisible] = useState(false);

  const onToggleAdvancedFilter = () => {
    setAdvancedFilterVisible(!isAdvancedFilterVisible);
  };

  return (
    <Form layout="vertical">
      <Card
        className={css`
          .ant-tabs-tab-active > .ant-tabs-tab-btn {
            color: #ff0000 !important;
          }

          .ant-tabs-ink-bar {
            background-color: #ff0000 !important;
          }
        `}
      >
        <Tabs activeKey={currentTab} onChange={onTabChange}>
          <Tabs.TabPane tab="ประชาชน" key="citizen" />
          {/* <Tabs.TabPane tab="เจ้าหน้าที่" key="officer" /> */}
        </Tabs>
        <Row
          style={{
            flexDirection: 'row',
          }}
          gutter={[12, 12]}
          align="bottom"
          justify="space-between"
          className="gx-mb-3"
        >
          {/* <Col xs={24} sm={24} md={24} lg={20} xl={20} xxl={20}> */}
          <Col xs={24}>
            <div className="gx-w-100">
              <Typography.Text>ค้นหา</Typography.Text>
              <Input.Search
                placeholder="ค้นหา"
                className="gx-w-100 gx-mt-1 gx-mb-0"
                disabled={isAdvancedFilterVisible}
                onKeyUp={onSeachChange}
              />
            </div>
          </Col>
          {/* <Col xs={24} sm={24} md={24} lg={4} xl={4} xxl={4}>
            <Button icon={<FilterOutlined />} type="primary" onClick={onToggleAdvancedFilter} block>
              {isAdvancedFilterVisible ? 'ซ่อนตัวกรอง' : 'เพิ่มตัวกรอง'}
            </Button>
          </Col> */}
        </Row>
        {isAdvancedFilterVisible && (
          <Row
            gutter={[12, 0]}
            style={{
              flexDirection: 'row',
            }}
          >
            <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
              <Form.Item label="ประเภท">
                <Select placeholder="เลือกประเภท" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
              <Form.Item label="ประเภทขอบเขต">
                <Select placeholder="เลือกประเภทขอบเขต" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
              <Form.Item label="พื้นที่ขอบเขต">
                <Select placeholder="เลือกพื้นที่" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
              <Form.Item label="สถานะ">
                <Select placeholder="เลือกสถานะ" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
              <Form.Item label="หน่วยงาน">
                <Select placeholder="เลือกหน่วยงาน" />
              </Form.Item>
            </Col>
          </Row>
        )}
      </Card>
    </Form>
  );
};
