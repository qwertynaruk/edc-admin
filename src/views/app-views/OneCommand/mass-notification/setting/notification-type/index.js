import { Button, Input, Menu, Typography } from 'antd';

import LabsContent from 'components/layout-components/LabsContent';
import { MassNotificationTypeSettingForm } from 'features/mass-notification';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import { SearchOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { useState } from 'react';

const NOTIFICATION_TYPE = [
  {
    label: 'การจราจรแออัด',
    key: 'traffic',
  },
  {
    label: 'วัตถุต้องสงสัย',
    key: 'suspicious-object',
  },
  {
    label: 'เหตุยิงปืน',
    key: 'shooting',
  },
  {
    label: 'เหตุระเบิด',
    key: 'explosion',
  },
  {
    label: 'อุบัติเหตุ',
    key: 'accident',
  },
  {
    label: 'อื่นๆ',
    key: 'others',
  },
];

const NotificationTypeSettingPage = () => {
  const [isSearchVisible, setSearchVisible] = useState(false);

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
  };

  return (
    <>
      <PageBreadcrumb
        pageLabel={{
          master: 'Mass Notification',
          subpath: 'ตั้งค่า',
        }}
      />
      <div
        className={css`
          .gx-module-box-content {
            overflow-y: auto !important;
            padding: 20px !important;
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
          titleContent={<Typography.Text className="gx-mb-0">ประเภทการแจ้งเตือน</Typography.Text>}
          sideContent={
            <>
              <div
                style={{
                  display: 'flex',
                  padding: '20px 20px 0 20px',
                }}
              >
                <Button type="primary" block className="gx-mb-2">
                  เพิ่ม
                </Button>
                <Button onClick={toggleSearch}>
                  <SearchOutlined />
                </Button>
              </div>
              {isSearchVisible && (
                <div
                  style={{
                    padding: '0 20px',
                  }}
                >
                  <Input />
                </div>
              )}
              <Menu items={NOTIFICATION_TYPE} />
            </>
          }
          header={<></>}
        >
          <MassNotificationTypeSettingForm />
        </LabsContent>
      </div>
    </>
  );
};

export default NotificationTypeSettingPage;
