import { ArrowUpOutlined, CloseCircleFilled, FilterFilled, SettingOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space, Tag, Typography } from 'antd';
import { FilterCardDrawer, SearchFieldBox } from 'features/lost-found/component';
import { useLocation, useNavigate } from 'react-router-dom';

import { LostReportTable } from '../lost-report-table';
import { SpBreadCrumb } from 'features/shared';
import { useState } from 'react';

export function LostReportHomePage() {
  const navigate = useNavigate();
  const locations = useLocation();
  const [toggleFilter, setToggleFilter] = useState(false);

  const onToggleFilter = () => {
    setToggleFilter(!toggleFilter);
  };

  const onCreate = () => {
    navigate(`${locations.pathname}/create`);
  };

  return (
    <Row gutter={[8, 8]}>
      <Col xs={24} md={toggleFilter ? 18 : 24}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12} lg={16}>
            <SpBreadCrumb parentRoute={[{ name: 'รายการแจ้งของหาย' }]} />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Space style={{ justifyContent: 'flex-end' }}>
              <Button type="text" icon={<FilterFilled />} onClick={onToggleFilter}>
                {toggleFilter ? 'Hide' : 'Show'} Filter
              </Button>

              <Button type="primary" onClick={onCreate}>
                เพิ่มรายการ
              </Button>
              <Button type="primary">
                <SettingOutlined />
              </Button>
            </Space>
          </Col>
          <Col xs={24}>
            <SearchFieldBox />
          </Col>
          <Col xs={24}>
            <Space direction="vertical">
              <Row gutter={[6, 6]} align="middle">
                <Col xs={24} sm={18} md={20}>
                  <Space>
                    <Typography.Title level={5} style={{ marginBottom: 0 }}>
                      ผลลัพท์
                    </Typography.Title>
                    <Tag
                      closable
                      closeIcon={<CloseCircleFilled style={{ fontSize: 14, opacity: 0.4 }} />}
                      style={{ backgroundColor: '#111620', border: '1px solid #000', marginBottom: 0 }}
                    >
                      Open
                    </Tag>
                  </Space>
                </Col>
                <Col xs={24} sm={6} md={4}>
                  <Space align="end" direction="vertical">
                    <Button type="text" icon={<ArrowUpOutlined />}>
                      Name
                    </Button>
                  </Space>
                </Col>
              </Row>

              <LostReportTable />
            </Space>
          </Col>
        </Row>
      </Col>
      {toggleFilter && (
        <Col xs={24} md={6}>
          <FilterCardDrawer />
        </Col>
      )}
    </Row>
  );
}
