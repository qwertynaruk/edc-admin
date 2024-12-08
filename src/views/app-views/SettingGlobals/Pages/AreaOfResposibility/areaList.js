import { Avatar, Card, Col, Divider, List, Row, Skeleton } from 'antd';
import { useEffect, useState } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';

const AreaList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch('https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo')
      .then((res) => res.json())
      .then((body) => {
        setData([...data, ...body.results]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    loadMoreData();
  }, []);
  return (
    <Card>
      <div
        id="scrollableDiv"
        style={{
          height: 400,
          overflow: 'auto',
          padding: '0 16px',
          border: '1px solid rgba(140, 140, 140, 0.35)',
        }}
      >
        <InfiniteScroll
          dataLength={data.length}
          next={loadMoreData}
          hasMore={data.length < 50}
          loader={
            <Skeleton
              avatar
              paragraph={{
                rows: 1,
              }}
              active
            />
          }
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            header={
              <div>
                <Row justify="space-between">
                  <Col span={4}>ชื่อพื้นที่ (TH)</Col>
                  <Col span={4}>
                    ชื่อพื้นที่ (EN) <Divider type="vertical" />
                  </Col>
                  <Col span={4}>
                    ชื่อพื้นที่ (TH)
                    <Divider type="vertical" />
                  </Col>
                  <Col span={4}>
                    ชื่อย่อพื้นที่ (EN)
                    <Divider type="vertical" />
                  </Col>
                  <Col span={4}>
                    อยู่ใช้ในหน่วยงาน
                    <Divider type="vertical" />
                  </Col>
                </Row>
              </div>
            }
            dataSource={data}
            renderItem={(item) => {
              return (
                <List.Item key={item.email}>
                  <List.Item.Meta
                    avatar={<Avatar src={item.picture.large} />}
                    title={<a href="https://ant.design">{item.name.last}</a>}
                    description={item.email}
                  />
                  <div>Content</div>
                </List.Item>
              );
            }}
          />
        </InfiniteScroll>
      </div>
    </Card>
  );
};
export default AreaList;
