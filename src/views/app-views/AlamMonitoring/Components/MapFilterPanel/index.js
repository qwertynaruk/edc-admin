import { Avatar, Badge, Card, Col, Empty, Input, Row, Space, Spin, Typography } from 'antd';
import { CheckOutlined, SearchOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';

import moment from 'moment';

const MapFilterPanelAlarmMonitoring = ({
  menuContentLoading,
  dataList,
  selectData,
  handleShareData,
  setPositionScrolling,
  getSearch,
}) => {
  const [colorBorder, setColorBorder] = useState('leave');

  function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  }

  const onSearchList = debounce((sss) => getSearch(sss.target.value || null), 1000);

  function backgroundColor(status) {
    if (!status) {
      return '#161e2b2B';
    } else {
      return '#161e2b';
    }
  }

  const scrollDivRef = useRef(null);

  const handleClickEvent = (data, typeEvent) => {
    // selectData(null);
    if (typeEvent === 'share') {
      handleShareData(data, typeEvent);
    } else if (typeEvent === 'location') {
      const payload = {
        ...data,
        latLong: {
          lat: data?.location?.coordinates?.[0],
          lng: data?.location?.coordinates?.[1],
        },
      };
      selectData(payload);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const position = Math.ceil((scrollTop / (scrollHeight - clientHeight)) * 100);
    setPositionScrolling(position);
    // setScrollPosition(position);
  };

  function dateTimeFormat(date) {
    if (!date) {
      return null;
    }
    try {
      // console.log(date.length);
      const convertedTime = moment(date).format('DD MMM YYYY HH:mm');

      return convertedTime;
    } catch (error) {
      return null;
    }
  }

  const handleColor = (id) => {
    if (id === colorBorder) {
      return '5px solid #173b75';
    } else {
      return '1px solid #000';
    }
  };

  return (
    <>
      <Card
        title={
          <>
            <Space direction="vertical" size={15}>
              <Space className="gx-space-between">
                <Typography.Text strong>ประเภทของข้อมูล (20 เหตุการณ์ล่าสุด)</Typography.Text>
              </Space>
              <Input prefix={<SearchOutlined className="gx-mr-2" />} placeholder="ค้นหา...." onChange={onSearchList} />
            </Space>
          </>
        }
        style={{
          width: '100%',
          height: '100%',
          paddingRight: '0px',
        }}
        bodyStyle={{
          padding: '0px',
          display: 'inline-block',
          overflowY: 'auto',
          overflowX: 'visible',
          height: '80%',
          width: '100%',
        }}
      >
        <div
          style={{
            height: '100%',
            overflowY: 'auto',
          }}
          ref={scrollDivRef}
          onScroll={(e) => handleScroll(e)}
        >
          {dataList?.map((data, key) => {
            return (
              // <a key={key}>
              <Card
                bodyStyle={{
                  overflowX: 'visible',
                  overflowY: 'visible',
                  padding: '5px',
                  width: '100%',
                  maxWidth: '100%',
                }}
                key={key}
                bordered={false}
                style={{
                  marginBottom: '0px',
                  padding: '0px',
                  backgroundColor: backgroundColor(data?.is_read || false),
                  border: handleColor(data?.objectid),
                  borderRadius: '0px',
                  overflowX: 'visible',
                  overflowY: 'visible',
                }}
                onMouseOver={() => setColorBorder(data?.objectid)}
                onMouseLeave={() => setColorBorder(null)}
              >
                <div onClick={() => handleClickEvent(data, 'location')}>
                  <Row
                    justify="space-between"
                    align="middle"
                    style={{
                      marginLeft: '5px',
                      marginRight: '15px',
                      paddingRight: '0px',
                      width: '90%',
                    }}
                  >
                    <Typography
                      style={{
                        width: '80%',
                      }}
                      onClick={() => handleClickEvent(data, 'location')}
                    >
                      {data?.title || 'ไม่มีข้อมูล'}
                    </Typography>
                    <a
                      onClick={() => handleClickEvent(data, 'share')}
                      style={{
                        zIndex: 4,
                      }}
                    >
                      <Badge
                        count={
                          <>
                            {data?.department_share?.length >= 1 ? (
                              <Avatar
                                style={{
                                  backgroundColor: '#29CC6A',
                                  border: '1px solid ',
                                  marginLeft: '-10px',
                                  marginTop: '15px',
                                }}
                                icon={<CheckOutlined style={{ color: '#028135' }} />}
                                size={15}
                              />
                            ) : null}
                          </>
                        }
                        offset={[-5, 35]}
                      >
                        <Avatar
                          style={{
                            backgroundColor: '#0E2848',
                            verticalAlign: 'middle',
                            border: '1px solid ',
                          }}
                          icon={<ShareAltOutlined size={20} />}
                        />
                      </Badge>
                    </a>
                  </Row>
                </div>
                <div>
                  <a onClick={() => handleClickEvent(data, 'location')}>
                    <Row
                      justify="space-between"
                      style={{
                        marginLeft: '5px',
                        marginRight: '15px',
                        paddingRight: '0px',
                        width: '90%',
                      }}
                    >
                      <Typography>{data?.name || 'ไม่มีข้อมูล'}</Typography>
                      <Typography>{dateTimeFormat(data?.log_time)}</Typography>
                    </Row>
                    <Row
                      justify="start"
                      style={{
                        marginLeft: '5px',
                        marginRight: '15px',
                        paddingRight: '10px',
                        width: '90%',
                      }}
                    >
                      <Col>
                        <Typography>{data?.object_uuid}</Typography>
                        <Typography>{data?.description || 'ไม่มีข้อมูล'}</Typography>
                      </Col>
                    </Row>
                  </a>
                </div>
              </Card>
              // </a>
            );
          })}

          {menuContentLoading ? (
            <div
              style={{
                width: dataList.length > 0 ? '100%' : '100%',
                height: '70px',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '20px',
                textAlign: 'center',
              }}
            >
              <Spin tip="Loading..." size="large" />
            </div>
          ) : null}
          {dataList.length === 0 && !menuContentLoading ? (
            <div
              style={{
                width: dataList.length > 0 ? '100%' : '100%',
                height: '70px',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '20px',
                textAlign: 'center',
              }}
            >
              <Empty />
            </div>
          ) : null}
        </div>
      </Card>
    </>
  );
};

export default MapFilterPanelAlarmMonitoring;
