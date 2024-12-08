import { Badge, Button, Col, List, Popover, Row, Space, Typography } from 'antd';
import { BellOutlined, SyncOutlined } from '@ant-design/icons';
import { findNotification, navigatePath } from 'utils/NotificationHelper';
import { useEffect, useMemo, useState } from 'react';

import { AppMenuListOneCommand } from 'views/app-views/OneCommand/AppMenuList';
// import EmptyDisplay from 'utils/EmptyDisplay';
import NotificationService from 'services/NotificationService';
import NotificationStore from 'mobx/NotificationStore';
import { ThaiDateTime } from 'utils/ThaiDateTime';
import UserStore from 'mobx/UserStore';
import _ from 'lodash';
import { css } from '@emotion/css';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import useSound from 'use-sound';

export const NotificationItemMeta = (props = {}) => {
  const { item } = props;
  const findDataType = useMemo(() => {
    const mapData = findNotification(item);
    return mapData;
  }, [item]);

  return (
    <>
      <List.Item.Meta
        className={css`
          padding-right: 8px;
          padding-left: 8px;
        `}
        // avatar={
        //   <Space align="center" style={{ marginLeft: '16px', marginTop: '2px' }}>
        //     {findDataType?.icon}
        //   </Space>
        // }
        avatar={findDataType?.icon}
        title={
          <Space direction="vertical">
            {item.message ? (
              <>
                <Space>{findDataType?.title}</Space>
              </>
            ) : null}
            <>
              <Space>{findDataType?.detail}</Space>
            </>
          </Space>
        }
        description={
          <Typography.Text
            className={css`
              font-size: 0.7rem;
              display: flex;
              justify-content: space-between;
            `}
          >
            <span>{item.created_at ? ThaiDateTime(item.created_at, 'short-month-full') : ''}</span>
            <span>{item?.is_read === false ? 'New' : ''}</span>
          </Typography.Text>
        }
      />
    </>
  );
};
export const NotificationItem = (props = {}) => {
  const { item = {}, onFinish, isLoading } = props;
  const navigate = useNavigate();
  return (
    <List.Item
      key={item.id}
      style={{ backgroundColor: !item.is_read && '#374256' }}
      loading={isLoading}
      // className="gx-pointer"
      className={css`
        .ant-list-item-meta {
          margin-bottom: 0px;
        }
        svg {
          margin-top: 80%;
        }
        cursor: pointer;
      `}
      onClick={() => {
        if (item.is_read === false) {
          // NotificationStore.UpdateLocal(item.id, { is_read: true });
          NotificationStore.UpdateSilent(item.id, { is_read: true });
        }
        const path = navigatePath(item);

        if (path === 'sos' || path === 'sos-detail') {
          const token = UserStore?.accessAuthen?.refresh_token;
          const userId = UserStore?.user?._id;
          const findSOS = AppMenuListOneCommand.find((rd) => rd.key === 'checkpoint-kiosk');
          if (findSOS) {
            if (path === 'sos') {
              window.open(findSOS?.direct_url + `?token=${token}&userId=${userId}`, '_blank');
            } else {
              window.open(findSOS?.direct_url + `?token=${token}&userId=${userId}&report_id=${item?.ref_id}`, '_blank');
            }
          }
        } else if (path) {
          navigate(path);
        }
      }}
    >
      <NotificationItemMeta item={item} />
    </List.Item>
  );
};
const PopupNotification = observer((props) => {
  const navigate = useNavigate();
  const { setVisible, dataSource, isLoading, refetchData = undefined } = props;

  const { mutateAsync, isLoading: isLoadingReadAll, isPending } = NotificationService.useReadNotificationAll();

  return (
    <>
      <div className="gx-popover-header" style={{ minWidth: 500 }}>
        <Typography.Title level={4} className="gx-mb-0">
          การแจ้งเตือน
        </Typography.Title>
        <Button
          // type="link"
          style={{ color: '#ffffff !important', backgroundColor: 'unset', opacity: '40%' }}
          onClick={() => {
            mutateAsync({
              onSettled: () => {
                refetchData?.();
              },
            });
          }}
        >
          {isPending ? <SyncOutlined spin /> : 'Mark All as Read'}
        </Button>
      </div>
      <div style={{ maxHeight: 280, overflowY: 'auto' }}>
        <List
          itemLayout="vertical"
          className="gx-p-1"
          dataSource={dataSource}
          renderItem={(item) => {
            const findDataType = findNotification(item);
            return (
              <List.Item
                style={{
                  backgroundColor: item?.is_read === false ? '#374356' : undefined,
                  padding: 8,
                  marginBottom: 0,
                }}
                className={css`
                  .ant-list-item-meta {
                    margin-bottom: 0px;
                  }
                  svg {
                    margin-top: 100%;
                  }
                  cursor: pointer;
                `}
                onClick={() => {
                  if (item.is_read === false) {
                    NotificationStore.UpdateLocal(item.id, { is_read: true });
                    NotificationStore.UpdateSilent(item.id, { is_read: true });
                  }
                  const path = navigatePath(item);

                  if (path === 'sos' || path === 'sos-detail') {
                    const token = UserStore?.accessAuthen?.refresh_token;
                    const userId = UserStore?.user?._id;
                    const findSOS = AppMenuListOneCommand.find((rd) => rd.key === 'checkpoint-kiosk');
                    if (findSOS) {
                      if (path === 'sos') {
                        window.open(findSOS?.direct_url + `?token=${token}&userId=${userId}`, '_blank');
                      } else {
                        window.open(
                          findSOS?.direct_url + `?token=${token}&userId=${userId}&report_id=${item?.ref_id}`,
                          '_blank'
                        );
                      }
                    }
                  } else if (path) {
                    navigate(path);
                  }
                  setVisible(false);
                }}
              >
                <List.Item.Meta
                  className={css`
                    .ant-list-item-meta-title {
                      margin-bottom: 5px;
                    }
                  `}
                  avatar={findDataType?.icon}
                  title={
                    <Typography.Text>
                      <Space>{findDataType?.title}</Space>
                    </Typography.Text>
                  }
                  description={
                    <>
                      {findDataType?.detail}
                      <Typography.Text
                        className={css`
                          font-size: 0.7rem;
                          display: flex;
                          justify-content: space-between;
                          margin-top: 10px;
                        `}
                      >
                        {findDataType?.createTime}
                      </Typography.Text>
                    </>
                  }
                />
              </List.Item>
            );
          }}
        />
      </div>
      <Row justify="center">
        <Col>
          <Button
            style={{ color: '#ffffff !important', backgroundColor: 'unset', border: 'unset' }}
            onClick={() => {
              navigate('/app/notification');
              setVisible(false);
            }}
          >
            แสดงข้อความทั้งหมด
          </Button>
        </Col>
      </Row>
    </>
  );
});
const NavNotification = (props) => {
  const [visible, setVisible] = useState(false);
  const [play] = useSound(process.env.REACT_APP_SOUND_NOTIFICATION, { volume: 0.25 });
  const [badgeShow, setBadgeShow] = useState(false);

  const { data, isLoading, refetch } = NotificationService.useGetNotificationList({
    queryParams: {
      sort_field: 'created_at',
      sort_value: 'desc',
      page: '1',
      page_size: '10',
      from: 'web',
    },
    interval: 16000,
  });
  useEffect(() => {
    const dataList = data || [];
    let notiList = localStorage.getItem('noti-data');
    notiList = JSON.parse(notiList);
    if (data?.total_record > notiList?.total_record || _.isEmpty(notiList)) {
      localStorage.setItem('noti-data', JSON.stringify(dataList));
      play();
    }
    const isRead = (dataList?.data || []).some((x) => x.is_read === false);
    if (isRead) {
      setBadgeShow(isRead);
    }
    return () => {
      setBadgeShow(false);
    };
  }, [data, play]);
  return (
    <Popover
      overlayClassName="gx-popover-horizantal"
      placement="bottomRight"
      content={
        <PopupNotification
          {...props}
          refetchData={refetch}
          dataSource={data?.data || []}
          isLoading={isLoading}
          setVisible={setVisible}
        />
      }
      trigger="click"
      visible={visible}
      onVisibleChange={(visible) => {
        setVisible(visible);
        if (visible === true) {
          NotificationStore.Read();
        }
      }}
    >
      <Badge dot={badgeShow}>
        <BellOutlined className="gx-pointer" />
      </Badge>
    </Popover>
  );
};

export default observer(NavNotification);
