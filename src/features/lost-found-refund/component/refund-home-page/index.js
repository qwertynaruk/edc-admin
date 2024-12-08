import { Button, Card, Col, Row, Space } from 'antd';
import { FilterCardDrawer, SearchFieldBox } from 'features/lost-found/component';
import { useLocation, useNavigate } from 'react-router-dom';

import { FilterFilled } from '@ant-design/icons';
import { RefundTable } from '../refund-table';
import { SpBreadCrumb } from 'features/shared';
import { useState } from 'react';

export function RefundHomePage() {
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
            </Space>
          </Col>
          <Col xs={24}>
            <SearchFieldBox />
          </Col>
          <Col xs={24}>
            <Card bodyStyle={{ padding: 0 }} style={{ overflow: 'hidden', borderTop: '0' }}>
              <RefundTable />
            </Card>
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
