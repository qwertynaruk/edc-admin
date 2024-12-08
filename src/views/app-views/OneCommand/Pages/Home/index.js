import { Card, Col, Grid, Row } from 'antd';
import { useEffect, useState } from 'react';

import { AppMenuListOneCommand } from '../../AppMenuList';
import Guarded from 'components/shared-components/Guarded';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import UserStore from 'mobx/UserStore';
import { observer } from 'mobx-react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const { useBreakpoint } = Grid;

const MenuCard = styled(Card)`
  cursor: pointer;
  margin-bottom: 0px !important;
  height: ${(props) => props.height}px;

  &:hover {
    box-shadow: 0 0 5px #ddd;
  }

  > .ant-card-body {
    height: 100%;
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const [underLaptopSize, setUnderLaptopSize] = useState(130);

  useEffect(() => {
    handleResize();

    window.addEventListener('resize', handleResize);
  }, []);

  const screens = useBreakpoint();

  const handleResize = () => {
    setUnderLaptopSize(window.innerWidth < 1600 ? 155 : '100%');
  };

  const onMenuHandleClick = (items) => {
    if (!items) return;
    const { direct_url: directUrl = '', url_type: urlType = '', key = '' } = items;

    if (key === 'checkpoint-kiosk') {
      // const token = UserStore.accessAuthen.access_token;
      const token = UserStore?.accessAuthen?.refresh_token;
      // console.log('refresh', token);
      const userId = UserStore?.user?._id;
      // skip token and userId
      // window.open(directUrl + `?token=${token}&userId=${userId}`, '_blank');

      if (!token || !userId) {
        window.location.reload();
      } else {
        window.open(directUrl + `?token=${token}&userId=${userId}`, '_blank');
      }
      return;
    }

    if (key === 'social-enable') {
      window.open('https://udoncop.socialenable.co', '_blank');
    }

    if (directUrl) {
      if (urlType === 'external') {
        window.open(directUrl, '_blank');
      } else {
        navigate('../' + directUrl);
      }
    }
  };

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'One Command' }} />
      <div>
        <Row className="gx-mt-4" gutter={[16, 16]}>
          {AppMenuListOneCommand.map((el, _index) => (
            <Guarded key={_index} query={el?.query}>
              {!el?.isDisable && (
                <Col sm={24} md={12} lg={8} span={24}>
                  <MenuCard height={underLaptopSize} onClick={() => onMenuHandleClick(el)}>
                    <Row align="middle" justify="center" style={{ height: '100%' }}>
                      <Col sm={24} md={8} span={24} style={{ textAlign: 'center' }}>
                        {el.icon_path}
                      </Col>
                      <Col sm={24} md={16} align={screens?.xs ? 'middle' : 'undefined'}>
                        <p className="gx-mb-2" style={{ fontSize: 17 }}>
                          {el.name}
                        </p>
                        <p className="gx-mb-0">{el.description}</p>
                      </Col>
                    </Row>
                  </MenuCard>
                </Col>
              )}
            </Guarded>
          ))}
        </Row>
      </div>
    </>
  );
};

export default observer(Home);
