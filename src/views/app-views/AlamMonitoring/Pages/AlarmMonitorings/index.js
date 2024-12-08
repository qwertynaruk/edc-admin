import 'dayjs/locale/th';

import { Button, Card, Col, Row, Tag, Typography, notification } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import AlarmMonitoringService from 'services/AlarmMonitoringService';
import { CalendarOutlined } from '@ant-design/icons';
import DetailModalMap from '../../Components/DetailModalMap';
import MapAlarmMonitoring from '../../Components/Map';
import MapFilterPanelAlarmMonitoring from '../../Components/MapFilterPanel';
import ModalImage from '../../Components/ModalImage';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import ShareEventModal from '../../Components/ShareEventModal';
import alarmSound from '../../Components/MapFilterPanel/alarm.mp3';
import { css } from '@emotion/css';
import moment from 'moment';
import useSound from 'use-sound';

const AlarmMonitoringPage = () => {
  const [selectEvent, setSelectEvent] = useState(null);
  const [loading, setLoading] = useState(null);
  const [shareDetail, setShareDetail] = useState(null);
  const [eventData, setEventData] = useState([]);
  const [markerDatas, setMarkerDatas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogImage, setOpenDialogImage] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [loadMore, setLoadMore] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectOganization, setSelectOganization] = useState([]);
  const [debouncedValue, setDebouncedValue] = useState('');
  const [searchNameValue, setSearchNameValue] = useState([]);
  const [imageData, setImageData] = useState();

  const [play, { stop }] = useSound(alarmSound, {
    interrupt: true,
    sprite: {
      first: [0, 3000],
    },
  });

  const getEventList = async () => {
    setLoading(true);
    const pageNumbers = loadMore === 0 ? 1 : pageNumber;
    try {
      const resp = await AlarmMonitoringService.getAlarmMonitoringListParams({
        page: pageNumbers,
        page_size: 20,
        sort_field: 'created_at',
        sort_value: 'DESC',
      });
      if (resp) {
        setTotalPage(resp.total_page);
        setTotalRecord(resp.total_record);
        const ll = totalRecord !== resp.total_record;
        if (eventData.length === 0) {
          const aa =
            resp?.data?.filter((data) => {
              const dateObj = new Date(data?.created_at).getTime();
              return new Date().getTime() - dateObj <= 10000;
            }) ?? [];

          aa?.map((data) => {
            return openNotification(data);
          });
          setEventData(resp?.data);
        } else if (eventData?.length !== 0 && resp?.data?.length === 0) {
          setEventData(resp?.data);
        } else if (eventData?.length > 0 && resp?.current_page === pageNumber) {
          const mergedArray = resp?.data.concat(eventData).reduce((acc, obj) => {
            const existing = acc?.find((item) => item?.objectid === obj?.objectid);
            return existing ? acc : [...acc, obj];
          }, []);

          // const fetchTime = async () => {
          //   setLoading(true);
          //   try {
          //     const response = await axios.get('http://worldtimeapi.org/api/timezone/Etc/UTC');
          //     return response.data.datetime;
          //   } catch (error) {
          //     console.error('Error fetching time:', error);
          //   }
          // };
          // fetchTime().then((date) => {
          const aa =
            resp?.data?.filter((data) => {
              const dateObj = new Date(data?.created_at).getTime();
              return new Date().getTime() - dateObj <= 10000;
            }) ?? [];

          if (aa?.length > 0 && ll) {
            setEventData(
              aa?.concat(mergedArray)?.reduce((acc, obj) => {
                const existing = acc?.find((item) => item?.objectid === obj?.objectid);
                return existing ? acc : [...acc, obj];
              }, [])
            );
            aa?.map((data) => {
              return openNotification(data);
            });
          } else if (aa?.length > 0 && !ll) {
            const findNewData =
              resp?.data?.filter((data) => {
                const dateObj = new Date(data?.created_at).getTime();
                return new Date().getTime() - dateObj <= 10000;
              }) ?? [];
            findNewData?.map((data) => {
              return openNotification(data);
            });

            setEventData(
              aa?.concat(mergedArray).reduce((acc, obj) => {
                const existing = acc?.find((item) => item?.objectid === obj?.objectid);
                return existing ? acc : [...acc, obj];
              }, [])
            );
          }
          if (!ll) {
            setEventData(
              aa?.concat(mergedArray).reduce((acc, obj) => {
                const existing = acc?.find((item) => item?.objectid === obj?.objectid);
                return existing ? acc : [...acc, obj];
              }, [])
            );
          }
          // });
        }

        setLoading(false);
        markerDataLists(resp?.data);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const search = async () => {
    try {
      const resp = await AlarmMonitoringService.getAlarmMonitoringListParams({
        page: 1,
        page_size: 20,
        sort_field: 'created_at',
        sort_value: 'DESC',
        name: debouncedValue,
      });
      if (resp?.data) {
        setSearchNameValue(resp?.data);
      } else {
        console.log('err', resp);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    getEventList();
  }, []);

  const markerDataLists = (datas) => {
    if (!loading && datas !== null) {
      const xx = datas?.map((data) => {
        return {
          ...data,
          latLong: {
            lat:
              data?.location?.latitude > data?.location?.longitude
                ? data?.location?.longitude
                : data?.location?.latitude,
            lng:
              data?.location?.longitude < data?.location?.latitude
                ? data?.location?.latitude
                : data?.location?.longitude,
          },
        };
      });
      setMarkerDatas(xx);
    } else return [];
  };

  const handleReadEvent = async (selectEventData) => {
    const id = await selectEventData?.objectid;
    await setSelectEvent(selectEventData);
    if (!selectEventData?.is_read)
      try {
        const resp = await AlarmMonitoringService.getAlarmMonitoringID(id);
        if (resp) {
          const xxx = eventData?.map((datas) => {
            if (datas?.objectid === id) {
              return {
                ...datas,
                is_read: true,
              };
            } else {
              return {
                ...datas,
              };
            }
          });
          setEventData(xxx);
        }
      } catch (err) {
        console.error(err);
      }
  };

  const handleShareData = (filterData) => {
    setOpenDialog(true);
    setShareDetail(filterData);
  };

  const handleOk = async () => {
    try {
      // check 4
      const resp = await AlarmMonitoringService.getAlarmMonitoringPahtShare(shareDetail.objectid, {
        department_share: selectOganization?.oganization,
      });
      if (resp?.data) {
        handelShareEvent();
        setOpenDialog(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handelShareEvent = async () => {
    const xxx = await eventData?.map((datas) => {
      if (datas.objectid === shareDetail?.objectid) {
        return {
          ...datas,
          department_share: selectOganization?.oganization,
        };
      } else {
        return {
          ...datas,
        };
      }
    });

    await setEventData(xxx);
    await setShareDetail(null);
  };

  const handleCancel = () => {
    setOpenDialog(false);
    setShareDetail(null);
  };

  const handleDialogDetailClick = () => {
    setOpenDetailDialog(true);
  };

  const handleDetailOk = () => {
    setOpenDetailDialog(false);
  };

  const handleDetailCancel = () => {
    setOpenDetailDialog(false);
  };

  const handleOpendialogNotification = async (dataDetail) => {
    await setSelectEvent(dataDetail);
    await setOpenDetailDialog(true);
  };

  const openNotification = (dataDetail) => {
    const key = `open${Date.now()}`;
    const handleClose = () => {
      stop();
      notification.close(key);
    };
    const btn = (
      <div
        style={{
          width: '100%',
        }}
      >
        <Button
          type="primary"
          size="small"
          onClick={() => {
            handleClose();
            handleOpendialogNotification(dataDetail);
          }}
          className={css`
            .dark-theme .ant-btn-primary {
              background-color: #3aa981 !important;
              border-color: #3aa981 !important;
            }
          `}
        >
          ดูข้อมูล
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => handleClose()}
          className={css`
            .dark-theme .ant-btn-primary {
              background-color: #dd4c1e !important;
              border-color: #dd4c1e !important;
            }
          `}
        >
          ปิดทิ้ง
        </Button>
      </div>
    );

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
        <Row gutter={12} key={contentDataLists?.objectid}>
          <Col span={{ sx: 24, xl: 12 }}>
            {(contentDataLists?.additional_data || [])?.map((data, index) => {
              if (data?.content_type === 'text') {
                return (
                  <Typography
                    key={index}
                    style={{
                      fontSize: '18px',
                      margin: 10,
                    }}
                  >
                    {data?.name.replace('สำคุญ', 'สำคัญ')} : {data.content}
                  </Typography>
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
        </Row>
      );
    };

    notification.open({
      description: <div>{handleContent(dataDetail)}</div>,
      placement: 'bottomRight',
      className: css`
        .ant-notification {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          color: #545454;
          font-size: 14px;
          font-variant: tabular-nums;
          line-height: 1.3;
          list-style: none;
          font-feature-settings: 'tnum';
          position: fixed;
          z-index: 10;
          margin-right: 24px;
        }
      `,
      duration: 9999,
      btn,
      key,
      onClose: () => {
        stop();
      },
      style: {
        background: '#1c2536',
        width: '100%',
        maxWidth: '700px',
      },
    });
    play({ id: 'first' });
  };

  const handleLoadMore = async () => {
    if (pageNumber < totalPage && !loading) {
      await setPageNumber(pageNumber + 1);
      await getEventList();
    } else return null;
  };

  const handleOpenImageDialog = (data) => {
    setOpenDialogImage(true);
    setImageData(data);
  };

  const handleImageDialogCancel = () => {
    setOpenDialogImage(false);
  };

  useEffect(() => {
    if (!loading) {
      const fetchData = async () => {
        await getEventList();
      };

      const intervalId = setInterval(fetchData, 10000);

      return () => clearInterval(intervalId);
    }
  }, [loading]);

  useMemo(() => {
    if (debouncedValue) {
      search();
    }
  }, [debouncedValue]);

  // useEffect(() => {
  //   if (loadMore === 100 && totalPage !== pageNumber) {
  //     handleLoadMore();
  //   }
  // }, [loadMore, totalPage, pageNumber]);

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'AlarmMonitoringPage' }} />
      <Row>
        <Col span={6} xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 7 }}>
          <Card
            bordered={false}
            style={{
              backgroundColor: '#ffffff00',
              padding: 0,
            }}
            bodyStyle={{
              padding: 0,
              width: '100%',
              height: '820px',
            }}
          >
            <MapFilterPanelAlarmMonitoring
              menuContentLoading={loading}
              dataList={
                debouncedValue
                  ? searchNameValue
                  : eventData?.sort((a, b) => b?.created_at?.localeCompare(a?.created_at))
              }
              selectData={(e) => handleReadEvent(e)}
              handleShareData={(e) => handleShareData(e)}
              setPositionScrolling={(e) => setLoadMore(e)}
              getSearch={(e) => setDebouncedValue(e)}
            />
          </Card>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 17 }}>
          {/* <LoadScript googleMapsApiKey={PKEY_GOOGLE_MAPS} libraries={lib}> */}
          <MapAlarmMonitoring
            markerDataList={markerDatas}
            selectEventData={selectEvent}
            onDialogDetailClick={(e) => handleDialogDetailClick(e)}
          />
          {/* </LoadScript> */}
        </Col>
      </Row>
      <ShareEventModal
        detailData={shareDetail}
        openDialog={openDialog}
        handleOk={() => handleOk()}
        handleCancel={() => handleCancel()}
        onShareData={(e) => setSelectOganization(e)}
      />
      <DetailModalMap
        detailData={selectEvent}
        openDialog={openDetailDialog}
        handleOk={() => handleDetailOk()}
        handleCancel={() => handleDetailCancel()}
        onClickImage={(e) => handleOpenImageDialog(e)}
      />
      <ModalImage
        isModalImageOpen={openDialogImage}
        imageUrl={imageData}
        handleImageCancel={() => handleImageDialogCancel()}
      />
    </>
  );
};

export default AlarmMonitoringPage;
