import { Card, Tabs } from 'antd';
import { useEffect, useState } from 'react';

import DataImportWidget from 'components/shared-components/DataImportWidget';
import { GuardHandles } from 'components/shared-components/Guarded';
import NoPermission from 'components/shared-components/NoPermission';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

const ImportPage = () => {
  const navigate = useNavigate();
  const [preload, setPreload] = useState(false);

  const tabItems = [
    // {
    //   name: 'รายงานประจำวันเกี่ยวกับคดี',
    //   key: 'daily',
    //   downloadUrl: 'https://docs.google.com/spreadsheets/d/19v_HusaFurFfNqsaY3WAPGZyUyBTz1DpJ85BhCghQrM/edit#gid=0',
    //   accesses: GuardHandles({
    //     query: {
    //       group: 'Incident Management',
    //       type: 'รายงานประจำวัน',
    //       name: 'แก้ไขข้อมูลรายงานประจำวัน',
    //     },
    //     abilities: 'canUpdate',
    //   }),
    // },
    {
      name: 'รายงานรับแจ้งเหตุ 191',
      key: 'dashboard_views',
      multipleKey: ['dashboard_views', 'online_report'],
      downloadUrl:
        'https://docs.google.com/spreadsheets/d/1JcJtTQ9O56Z5zHMBjyjI5cU0ycddXC0hABHFgVr_k3A/edit#gid=1068549804',
      accesses: GuardHandles({
        query: {
          group: 'Incident Management',
          type: 'รายงานรับแจ้งเหตุ 191',
          name: 'นำเข้าข้อมูลรายงานรับแจ้งเหตุ 191',
        },
        abilities: 'canUpdate',
      }),
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setPreload(false);
    }, 1000);
  }, [preload]);

  const onKeyChange = () => {
    setPreload(true);
  };

  const tabItemsList = tabItems.filter((uu) => uu?.accesses);

  return (
    <>
      <PageBreadcrumb history={history} pageLabel={{ master: 'รายงาน', subpath: 'นำเข้าข้อมูล' }} className="gx-mb-5" />
      {tabItemsList.length <= 0 ? (
        <NoPermission onOk={() => navigate(-1)}>
          <span>ไม่มีสิทธิ์การเข้าถึง</span>
          <span>หากต้องการสิทธิ์การเข้าถึงกรุณาติดต่อเจ้าหน้าที่ที่เกี่ยวข้อง</span>
        </NoPermission>
      ) : (
        <Card bodyStyle={{ padding: 0 }}>
          <Tabs
            className="with-extra-hightlight"
            defaultActiveKey="person"
            tabBarStyle={{ padding: '0 18px' }}
            onChange={(el) => onKeyChange(el)}
          >
            {tabItemsList.map((el) => (
              <TabPane tab={el.name} key={el.key}>
                <DataImportWidget
                  downloadOption={{
                    enable: true,
                    url: el?.downloadUrl || '',
                  }}
                  originModule={el?.key}
                  originModuleMultiple={el?.multipleKey}
                  exportType="xlsx"
                  pathBK="temp-upload-file-report"
                  objectIDReplaceUserID={true}
                />
              </TabPane>
            ))}
          </Tabs>
        </Card>
      )}
    </>
  );
};

export default ImportPage;
