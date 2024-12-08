import { Col, Row, Space, Spin, Typography } from 'antd';
import { SpSelectItemBrand, useSpSelectItemType } from 'features/shared';
import { useCallback, useState } from 'react';

import { CategoryItems } from '../category-items';

export function CategoryBox() {
  const categoryIs = 'phone';
  const [currentCategory, setCurrentCategory] = useState([]);
  const { data, isLoading } = useSpSelectItemType();

  const onCategoryChange = useCallback(
    (itemId) => {
      const founds = currentCategory?.find((ss) => ss === itemId);
      if (founds) {
        setCurrentCategory(currentCategory.filter((ss) => ss !== itemId));
      } else {
        setCurrentCategory((oldState) => [...oldState, itemId]);
      }
    },
    [currentCategory]
  );

  const colProps = categoryIs === 'phone' ? { xs: 24, md: 18, lg: 21 } : { xs: 24 };

  return (
    <Row>
      <Col {...colProps}>
        <Typography.Title level={5}>หมวดหมู่</Typography.Title>

        {data && (
          <Spin spinning={isLoading}>
            <Row gutter={[6, 6]}>
              {data?.map((ss, index) => (
                <Col key={index} xs={8} sm={6} md={4} lg={2}>
                  <CategoryItems items={ss} current={currentCategory} onClick={() => onCategoryChange(ss.id)} />
                </Col>
              ))}
            </Row>
          </Spin>
        )}
      </Col>

      {categoryIs === 'phone' && (
        <Col xs={24} md={6} lg={3}>
          <Space direction="vertical">
            <Typography.Text>Brand</Typography.Text>
            <SpSelectItemBrand />
          </Space>
        </Col>
      )}
    </Row>
  );
}
