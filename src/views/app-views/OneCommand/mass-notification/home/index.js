import { Button, Menu, Typography } from 'antd';
import { MassNotificationIcon, MassNotificationList, MassNotificationSearchFilter } from 'features/mass-notification';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { GuardHandlesV2 } from 'components/shared-components/Guarded';
import LabsContent from 'components/layout-components/LabsContent';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import { css } from '@emotion/css';
import { useGetMassNotificationLists } from 'features/mass-notification/hooks';

const MassNotificationHomePage = () => {
  const { canCreate } = GuardHandlesV2({ group: 'One Command', type: 'Mass Notification' });
  const [itemsList, setItemsList] = useState([]);
  const [isCurrentTab, setCurrentTab] = useState('citizen');
  const [filter, setFilter] = useState(undefined);
  const [countings, setCountings] = useState({
    all: 0,
    publish: 0,
    wait_for_send: 0,
    send_success: 0,
    send_not_success: 0,
    delete: 0,
    draft: 0,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const onCurrentTabChange = (tab) => {
    setCurrentTab(tab);
  };

  const onCreate = () => {
    navigate(`${location.pathname}/${isCurrentTab}/create`);
  };

  const onTest = () => {
    navigate(`${location.pathname}/${isCurrentTab}/test`);
  };

  const { data, isLoading } = useGetMassNotificationLists({
    params: filter,
  });

  const onMenuClick = (keys) => {
    if (keys.key !== 'all') {
      setFilter({
        status: keys.key,
      });
    } else {
      setFilter(undefined);
    }
  };

  const initCounting = (itemData) => {
    setCountings({
      all: itemData?.length || 0,
      publish: itemData?.filter((ss) => ss?.status === 'publish')?.length || 0,
      wait_for_send: itemData?.filter((ss) => ss?.status === 'wait_for_send')?.length || 0,
      send_success: itemData?.filter((ss) => ss?.status === 'send_success')?.length || 0,
      send_not_success: itemData?.filter((ss) => ss?.status === 'send_not_success')?.length || 0,
      delete: itemData?.filter((ss) => ss?.status === 'delete')?.length || 0,
      draft: itemData?.filter((ss) => ss?.status === 'draft')?.length || 0,
    });
  };

  const onSeachChange = (elem) => {
    const values = elem.target.value;

    if (values) {
      const x = data.filter(
        (ss) =>
          ss?.detail_message?.includes(values) ||
          ss?.notification_category?.name_th?.includes(values) ||
          ss?.organization_info?.full_name_th?.includes(values)
      );
      setItemsList(x);
      initCounting(x);
    } else {
      setItemsList(data);
      initCounting(data);
    }
  };

  useEffect(() => {
    if (data && data?.length > 0) {
      setItemsList(data);
    }

    if (filter === undefined) {
      initCounting(data);
    }
  }, [data]);

  return (
    <>
      <PageBreadcrumb pageLabel={{ subpath: 'Mass Notification' }} />
      <MassNotificationSearchFilter
        currentTab={isCurrentTab}
        onTabChange={onCurrentTabChange}
        onSeachChange={onSeachChange}
      />
      <div
        className={css`
          .gx-module-box-content {
            overflow-y: auto !important;
          }

          .ant-menu-submenu-title {
            padding-left: 0 !important;
          }

          .ant-menu-submenu > .ant-menu.ant-menu-sub .ant-menu-item {
            padding-left: 24px !important;
          }
        `}
      >
        <LabsContent
          titleContent={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 5,
              }}
            >
              <MassNotificationIcon width="30px" height="30px" />
              <Typography.Title level={5} className="gx-mb-0">
                MASS NOTIFICATION
              </Typography.Title>
            </div>
          }
          sideContent={
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '20px',
              }}
            >
              {canCreate && (
                <Button type="primary" block className="gx-mb-2" onClick={onCreate}>
                  เพิ่ม
                </Button>
              )}
              <Menu
                defaultSelectedKeys={['all']}
                defaultOpenKeys={['status']}
                className={css`
                  .ant-menu-item {
                    padding: 0 !important;
                  }
                `}
                mode="inline"
                items={[
                  {
                    label: `ทั้งหมด (${countings.all})`,
                    key: 'all',
                  },
                  {
                    label: 'สถานะ',
                    key: 'status',
                    children: [
                      {
                        label: `เผยแพร่ (${countings.publish})`,
                        key: 'publish',
                      },
                      {
                        label: `รอส่ง (${countings.wait_for_send})`,
                        key: 'wait_for_send',
                      },
                      {
                        label: `ส่งแล้ว (${countings.send_success})`,
                        key: 'send_success',
                      },
                      {
                        label: `ส่งไม่สำเร็จ (${countings.send_not_success})`,
                        key: 'send_not_success',
                      },
                      {
                        label: `ลบ (${countings.delete})`,
                        key: 'delete',
                      },
                    ],
                  },
                  {
                    label: `ฉบับร่าง (${countings.draft})`,
                    key: 'draft',
                  },
                ]}
                onClick={onMenuClick}
              />
            </div>
          }
          header={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end',
              }}
            >
              <Button type="primary" block className="gx-mb-2" onClick={onTest}>
                ทดสอบ
              </Button>
            </div>
          }
          headerStyle={{
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'end',
          }}
        >
          <MassNotificationList data={itemsList} isLoading={isLoading} />
        </LabsContent>
      </div>
    </>
  );
};

export default MassNotificationHomePage;
