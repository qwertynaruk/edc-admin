import { Card, Col, Row, Space, Typography } from 'antd';

import { AppMenuList } from './AppMenuList';
import { observer } from 'mobx-react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const MenuCard = styled(Card)`
  cursor: pointer;
  margin-bottom: 0px !important;
  height: 90px;
  border-color: #000;

  &:hover {
    box-shadow: 0 0 5px #000;
  }

  > .ant-card-body {
    height: 100%;
    padding: 16px;
    display: flex;
    align-items: center;
  }
`;

const Launchpad = () => {
  const navigate = useNavigate();

  return (
    <div style={{ marginBottom: 20 }}>
      <Row className="gx-mt-4" gutter={[8, 8]}>
        {AppMenuList.map((el) => (
          // <Guarded
          //   key={el.key}
          //   query={{
          //     group: el.key,
          //   }}
          // >
          <Col key={el.key} xs={24} md={12} lg={8}>
            <MenuCard onClick={() => el.direct_url && navigate(el.direct_url)}>
              <Space size={20} align="center">
                {el.icon_path}
                <Space direction="vertical" size={0}>
                  <Typography.Title level={5} style={{ marginBottom: 0 }}>
                    {el.name}
                  </Typography.Title>
                  <Typography.Text>{el.description}</Typography.Text>
                </Space>
              </Space>
            </MenuCard>
          </Col>
          // </Guarded>
        ))}
      </Row>
    </div>
  );
};

export default observer(Launchpad);
