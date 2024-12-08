import { Button, Card, Row, Tag, Typography } from 'antd';
import { CalendarOutlined, LoadingOutlined } from '@ant-design/icons';
import { GoogleMap, InfoWindow, Marker, useLoadScript } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';

import { PKEY_GOOGLE_MAPS_ONEFORCE } from 'constants/ApiConstant';
import { css } from '@emotion/css';
import moment from 'moment';

const containerStyle = {
  width: '100%',
  height: '100%',
};
const LIBRARIES = ['places'];
const MapAlarmMonitoring = (props) => {
  const { selectEventData, markerDataList, onDialogDetailClick } = props;
  const [map, setMap] = React.useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [centerMap, setCenterMap] = useState({
    lat: 13.736717,
    lng: 100.523186,
  });
  const [openInfo, setOpenInfo] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: PKEY_GOOGLE_MAPS_ONEFORCE,
    language: 'th',
    libraries: LIBRARIES,
  });

  const onLoad = React.useCallback(async function callback(map) {
    const bounds = await new window.google.maps.LatLngBounds({
      lat: 13.736717,
      lng: 100.523186,
    });
    // await map.minZoom(9);
    // await map.fitBounds(bounds);
    // await map.bounds(bounds);
    await map.setZoom(17);
    await map.setCenter(bounds);
    await map.setMapTypeId('satellite');

    // setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, []);

  // const onMapGroundClick = (ss) => {
  //   // setMarkerPosition(ss.latLng);

  //   console.log(ss.latLng.toJSON());
  // };

  const handleOpenInfoWindowMap = (selectEventData) => {
    const randomDecimal = (Math.random() * 10) / 100000000;
    if (selectEventData) {
      setCenterMap({
        lat:
          (selectEventData.location?.latitude > selectEventData.location?.longitude
            ? selectEventData.location?.longitude
            : selectEventData.location?.latitude || 13.736717) + randomDecimal,
        lng:
          (selectEventData.location?.longitude < selectEventData.location?.latitude
            ? selectEventData.location?.latitude
            : selectEventData.location?.longitude || 100.523186) + randomDecimal,
      });
      setOpenInfo(true);
    } else {
      setCenterMap({
        lat: 0,
        lng: 0,
      });
    }
  };

  useEffect(() => {
    if (selectEventData) {
      handleOpenInfoWindowMap(selectEventData);
    }
  }, [selectEventData]);

  useEffect(() => {
    if (markerDataList?.length === 0) {
      setOpenInfo(false);
    }
  }, [markerDataList]);

  const textClass = {
    fontSize: 16,
    paddingBottom: '5px',
    width: '100%',
  };

  function color(status) {
    if (status === 'active') {
      return '#FEE4E2';
    } else if (status === 'acknowledge') {
      return '#FEF0C7';
    } else {
      return '#CCFBEF';
    }
  }

  function colorText(status) {
    if (status === 'active') {
      return '#B42318';
    } else if (status === 'acknowledge') {
      return '#F79009';
    } else {
      return '#15B79E';
    }
  }

  const handleContent = (contentDataLists) => {
    const filterHidenContent = contentDataLists?.additional_data?.filter(
      (contentData) => contentData.hide_info === false
    );

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

    return filterHidenContent.map((data, key) => {
      if (data.content_type === 'text')
        return (
          <div key={key}>
            <Typography style={textClass}>
              {data?.name.replace('สำคุญ', 'สำคัญ')} : {data.content}
            </Typography>
          </div>
        );
      else if (data.content_type === 'datetime') {
        return (
          <div key={key}>
            <Typography style={textClass}>
              {data?.name} :{' '}
              <Tag>
                <Typography>
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
          </div>
        );
      } else {
        return (
          <Typography key={key} style={textClass}>
            Nothing
          </Typography>
        );
      }
    });
  };

  return (
    <Card>
      {/* <Row gutter={16} style={{ marginTop: 16 }}> */}
      <div
        style={{ height: '770px', width: '100%' }}
        className={css`
          .no-close-button-on-info-windows .gm-ui-hover-effect {
            visibility: hidden;
          }
        `}
      >
        {isLoaded ? (
          <>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={centerMap}
              // zoom={10}
              onLoad={onLoad}
              onUnmount={onUnmount}
              // onClick={onMapGroundClick}
              mapContainerClassName={css`
                button.gm-ui-hover-effect {
                  visibility: hidden;
                  display: none !important;
                }
              `}
              options={{
                backgroundColor: '#1b2531',
                styles: [
                  {
                    elementType: 'geometry',
                    stylers: [{ color: '#242f3e' }],
                  },
                  {
                    elementType: 'labels.text.stroke',
                    stylers: [{ color: '#242f3e' }],
                  },
                  {
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#746855' }],
                  },
                  {
                    featureType: 'administrative.locality',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#d59563' }],
                  },
                  {
                    featureType: 'poi',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#d59563' }],
                  },
                  {
                    featureType: 'poi.park',
                    elementType: 'geometry',
                    stylers: [{ color: '#263c3f' }],
                  },
                  {
                    featureType: 'poi.park',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#6b9a76' }],
                  },
                  {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [{ color: '#38414e' }],
                  },
                  {
                    featureType: 'road',
                    elementType: 'geometry.stroke',
                    stylers: [{ color: '#212a37' }],
                  },
                  {
                    featureType: 'road',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#9ca5b3' }],
                  },
                  {
                    featureType: 'road.highway',
                    elementType: 'geometry',
                    stylers: [{ color: '#746855' }],
                  },
                  {
                    featureType: 'road.highway',
                    elementType: 'geometry.stroke',
                    stylers: [{ color: '#1f2835' }],
                  },
                  {
                    featureType: 'road.highway',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#f3d19c' }],
                  },
                  {
                    featureType: 'transit',
                    elementType: 'geometry',
                    stylers: [{ color: '#2f3948' }],
                  },
                  {
                    featureType: 'transit.station',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#d59563' }],
                  },
                  {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{ color: '#17263c' }],
                  },
                  {
                    featureType: 'water',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#515c6d' }],
                  },
                  {
                    featureType: 'water',
                    elementType: 'labels.text.stroke',
                    stylers: [{ color: '#17263c' }],
                  },
                ],
              }}
              mapTypeId="terrain"
            >
              {markerDataList?.map((markerData, index) => {
                return (
                  <Marker
                    key={index}
                    position={markerData?.latLong}
                    onClick={() => handleOpenInfoWindowMap(markerData)}
                  />
                );
              })}
              {openInfo ? (
                <InfoWindow
                  position={centerMap}
                  style={{
                    marginTop: '-10px',
                  }}
                  className={`
                    button.gm-ui-hover-effect {
                      display: none !important;
                    }
                  `}
                >
                  <Card
                    style={{
                      width: '100%',
                      maxWidth: 450,
                      maxHeight: 400,
                      overflowY: 'auto',
                    }}
                    headStyle={{
                      padding: '0px',
                    }}
                    bordered={false}
                    title={
                      <>
                        <Row justify={'space-between'} align={'middle'}>
                          <Typography
                            style={{
                              fontSize: '18px',
                            }}
                          >
                            Alert & Alarm
                          </Typography>
                          {selectEventData.status !== ('' || undefined || null) ? (
                            <Tag
                              color={color(selectEventData.status)}
                              style={{
                                borderRadius: '20px',
                                textAlign: 'center',
                                fontSize: '16px',
                                color: `${colorText(selectEventData.status)}`,
                                fontWeight: 500,
                              }}
                            >
                              {selectEventData.status}
                            </Tag>
                          ) : null}
                        </Row>
                      </>
                    }
                    bodyStyle={{
                      padding: 10,
                      overflow: 'auto',
                    }}
                  >
                    <div>
                      {handleContent(selectEventData)}
                      <Button
                        onClick={() => onDialogDetailClick(selectEventData)}
                        style={{
                          width: '100%',
                          marginTop: '10px',
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        onClick={() => setOpenInfo(false)}
                        style={{
                          width: '100%',
                          marginTop: '10px',
                          backgroundColor: '#ffffff00',
                          color: '#ffffff',
                          border: '0px solid #ffffff00',
                        }}
                        type="text"
                      >
                        Close
                      </Button>
                    </div>
                  </Card>
                </InfoWindow>
              ) : null}
            </GoogleMap>
          </>
        ) : (
          <>
            <LoadingOutlined />
          </>
        )}
      </div>
      {/* </Row> */}
    </Card>
  );
};

export default MapAlarmMonitoring;
