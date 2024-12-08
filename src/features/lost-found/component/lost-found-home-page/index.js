import { ArrowUpOutlined, CloseCircleFilled, FilterFilled, SettingOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space, Spin, Tag, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

import { CategoryBox } from '../category-box';
import { FilterCardDrawer } from '../filter-card-drawer';
import { ItemsBox } from '../items-box';
import { SearchFieldBox } from '../search-field-box';
import { SpBreadCrumb } from 'features/shared';
import { useGetLostFoundList } from 'features/lost-found/hooks';
import { useState } from 'react';

export function LostFoundHomePage() {
  const navigate = useNavigate();
  const locations = useLocation();
  const { data, isLoading } = useGetLostFoundList();

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
            <SpBreadCrumb pageName="Manage items lost and found" />
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
            <CategoryBox />
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
              <Spin spinning={isLoading}>
                <Row>
                  {data?.map((ss, index) => (
                    <Col key={index} xs={12} sm={8} md={6} lg={4}>
                      <ItemsBox items={ss} />
                    </Col>
                  ))}
                </Row>
              </Spin>
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
