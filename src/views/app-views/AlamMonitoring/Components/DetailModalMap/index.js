import { Avatar, Col, Empty, Modal, Row, Space, Tag, Typography } from 'antd';
import IconCustom, { CalendarOutlined, QuestionOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';

import { ReactComponent as DoorContactIcon } from 'assets/images/door-contact.svg';
import { ReactComponent as IntrusionIcon } from 'assets/images/intrusion.svg';
import { ReactComponent as LidarIcon } from 'assets/images/lidar-sensor.svg';
import { ReactComponent as MotionIcon } from 'assets/images/motion-sensor.svg';
import { PKEY_GOOGLE_MAPS_ONEFORCE } from 'constants/ApiConstant';
import { ReactComponent as PanicButtonIcon } from 'assets/images/panic-button.svg';
import { ReactComponent as SmokeDetectorIcon } from 'assets/images/smoke-detector.svg';
import { css } from '@emotion/css';
import { getImageSize } from 'react-image-size';
import moment from 'moment';

const DetailModalMap = (props) => {
  const { detailData, openDialog, handleCancel, onClickImage } = props;
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [status, setStatus] = useState(false);
  const imgRef = useRef(null);
  const imgTypeRef = useRef(null);
  const imageEventRef = useRef(null);
  async function fetchImageSize(data) {
    try {
      const dimensions = await getImageSize(data);
      setDimensions(dimensions);
    } catch (error) {
      console.error(error);
    }
  }

  const iconTypePosition = (detailDatas) => {
    const data = detailDatas;

    const horizontal = (imgRef?.current?.offsetWidth / dimensions.width) * data.icon_detail.horizontal;
    const vertical = (imgRef?.current?.offsetHeight / dimensions.height) * (data.icon_detail.vertical + 40);

    function MarkerIcon(type) {
      if (type === 'lidar') {
        return <IconCustom component={LidarIcon} />;
      } else if (type === 'smoke_detector') {
        return <IconCustom component={SmokeDetectorIcon} />;
      } else if (type === 'panic_button') {
        return <IconCustom component={PanicButtonIcon} />;
        // <PanicAlarmIcon />;
      } else if (type === 'motion_sensor') {
        return <IconCustom component={MotionIcon} />;
      } else if (type === 'intrusion') {
        return <IconCustom component={IntrusionIcon} />;
      } else if (type === 'door_contact') {
        return <IconCustom component={DoorContactIcon} />;
      }

      return <QuestionOutlined />;
    }
    return (
      <Space>
        <Avatar
          icon={MarkerIcon(data.icon_detail.icon_name)}
          style={{
            fontSize: 30,
            position: 'absolute',
            backgroundColor: 'red',
            top: `${vertical || 0}px`,
            left: `${horizontal || 0}px`,
          }}
        />
      </Space>
    );
  };

  const handleContent = (contentDataLists) => {
    function dateTimeFormat(date) {
      if (!date) {
        return null;
      }
      try {
        const convertedTime = moment(date).format('DD MMM YYYY HH:mm');
        return convertedTime;
      } catch (error) {
        return null;
      }
    }

    return (
      <Row gutter={12} key={contentDataLists?.objectid} justify="space-between">
        <Col span={{ sx: 24, lg: 6, xl: 10 }}>
          {(contentDataLists?.additional_data || []).map((data, index) => {
            if (data?.content_type === 'text') {
              return (
                <div
                  style={{
                    width: '500px',
                  }}
                  key={index}
                >
                  <Typography
                    key={index}
                    style={{
                      fontSize: '18px',
                      margin: 10,
                    }}
                    width={460}
                  >
                    {data?.name.replace('สำคุญ', 'สำคัญ')} : {data.content}
                  </Typography>
                </div>
              );
            } else if (data?.content_type === 'datetime') {
              return (
                <Typography
                  key={index}
                  style={{
                    fontSize: '18px',
                    margin: 10,
                  }}
                >
                  {data?.name} : &nbsp;
                  <Tag
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: '18px',
                      }}
                    >
                      <CalendarOutlined
                        style={{
                          fontSize: '16px',
                          marginRight: 10,
                        }}
                      />
                      {dateTimeFormat(data.content)}
                    </Typography>
                  </Tag>
                </Typography>
              );
            } else {
              return <></>;
            }
          })}
        </Col>

        <Col span={{ sx: 24, lg: 18, xl: 14 }}>
          {contentDataLists?.additional_data.map((data, index) => {
            if (data?.content_type === 'floor_plan_icon') {
              return (
                <div key={index}>
                  <Typography.Title level={5}>{data?.name}</Typography.Title>
                  <Empty
                    style={{
                      display: status ? 'inline-block' : 'none',
                    }}
                  />
                  <div
                    style={{
                      display: !status ? 'inline-block' : 'none',
                    }}
                  >
                    <img
                      ref={imgRef}
                      src={data?.content?.floor_plan_url}
                      alt="Image"
                      style={{
                        display: !status ? 'inline-block' : 'none',
                        maxWidth: '560px',
                        // minHeight: '200px',
                        maxHeight: '350px',
                        width: '100%',
                        height: '100%',
                      }}
                      onError={() => setStatus(true)}
                      onLoad={() => setStatus(false)}
                    />
                    {iconTypePosition(data?.content)}
                  </div>
                </div>
              );
            } else if (data?.content_type === 'image_url') {
              return (
                <div key={index}>
                  <Typography.Title level={5}>{data?.name}</Typography.Title>
                  <Empty
                    style={{
                      display: status ? 'inline-block' : 'none',
                    }}
                  />
                  <div
                    style={{
                      display: !status ? 'inline-block' : 'none',
                    }}
                  >
                    <img
                      ref={imgTypeRef}
                      src={data?.content}
                      alt="Image"
                      style={{
                        display: !status ? 'inline-block' : 'none',
                        maxWidth: '760px',
                        minHeight: '300px',
                        maxHeight: '350px',
                        width: '100%',
                        height: '100%',
                      }}
                      onError={() => setStatus(true)}
                      onLoad={() => setStatus(false)}
                      onClick={() => onClickImage(data?.content)}
                    />
                  </div>
                </div>
              );
            } else {
              return <></>;
            }
          })}
        </Col>

        <Col
          span={24}
          style={{
            padding: '5px',
            alignContent: 'center',
          }}
        >
          {contentDataLists?.additional_data.map((data) => {
            if (data.content_type === 'gis_point') {
              const latitude =
                data?.content?.latitude > data?.content?.longitude
                  ? data?.content?.longitude
                  : data?.content?.latitude || 0;
              const longitude =
                data?.content?.longitude < data?.content?.latitude
                  ? data?.content?.latitude
                  : data?.content?.longitude || 0;

              const url = `https://www.google.com/maps/embed/v1/place?key=${PKEY_GOOGLE_MAPS_ONEFORCE}&q=${latitude},${longitude}&maptype=satellite`;
              return (
                <>
                  <Typography.Title level={5}>
                    {data?.name}: {contentDataLists?.location?.name}
                  </Typography.Title>
                  <div style={{ width: '100%' }}>
                    <iframe
                      width="100%"
                      height="350"
                      src={url}
                      style={{
                        visibility: 'visible',
                      }}
                    ></iframe>
                    <br />
                  </div>
                </>
              );
            } else {
              return <></>;
            }
          })}
        </Col>
      </Row>
    );
  };
  useEffect(() => {
    const xx = detailData?.additional_data.find((data) => data.content_type === 'floor_plan_icon');
    if (openDialog && xx) {
      fetchImageSize(xx.content.floor_plan_url);
    }
  }, [openDialog, detailData, imgRef?.current]);

  return (
    <>
      <Modal
        title={
          <>
            <Typography
              style={{
                fontSize: '20px',
              }}
            >
              Alert & Alarm
            </Typography>
          </>
        }
        visible={openDialog}
        onOk={handleCancel}
        onCancel={handleCancel}
        width={1200}
        bodyStyle={{ maxHeight: 1000, zIndex: 44 }}
        centered
        className={css`
          .ant-modal-footer .ant-btn + .ant-btn:not(.ant-dropdown-trigger) {
            margin-bottom: 0;
            margin-left: 8px;
            display: none;
          }
        `}
      >
        {/* <Row gutter={12}> */}
        {handleContent(detailData || { additional_data: [] })}
        {/* </Row> */}
      </Modal>
    </>
  );
};

export default DetailModalMap;
