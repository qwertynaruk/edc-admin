import { Card, Col, Image, Row, Spin } from 'antd';

import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';

const CrimeIntelligence = () => {
  const navigate = useNavigate();

  const dashboardSource = [
    {
      name: 'รายงานวิเคราะห์',
      quickSightId: {
        development: '664ebd56-bac4-45e1-81b9-31bdcc323799',
        production: '664ebd56-bac4-45e1-81b9-31bdcc323799',
      },
      thumbnail: '/img/dashboard/dashboard_b.png',
    },
  ];

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'Crime Intelligence' }} />

      <div className="gx-mt-4">
        <Spin spinning={false}>
          <Row gutter={24}>
            {dashboardSource.map((el, _index) => (
              <Col xs={24} sm={16} md={8} key={_index}>
                <Card
                  title={el.name}
                  headStyle={{ padding: 0 }}
                  bodyStyle={{ padding: 0, textAlign: 'center' }}
                  hoverable
                  onClick={() => navigate(`${el.name}/${el.quickSightId[process.env.REACT_APP_SERV]}`)}
                >
                  <Image src={el.thumbnail} height={230} preview={false} />
                </Card>
              </Col>
            ))}
          </Row>
        </Spin>
      </div>
    </>
  );
};

export default observer(CrimeIntelligence);
