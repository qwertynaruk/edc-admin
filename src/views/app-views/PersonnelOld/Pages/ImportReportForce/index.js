import { Card } from 'antd';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import DataImportWidget from 'components/shared-components/DataImportWidget';

const ImportReportForce = () => {
  return (
    <>
      <PageBreadcrumb
        history={history}
        pageLabel={{ master: 'กำลังพล', subpath: 'นำเข้าข้อมูล' }}
        className="gx-mb-5"
      ></PageBreadcrumb>
      <Card title="นำเข้าข้อมูลกำลังพล">
        <DataImportWidget
          downloadOption={{
            enable: true,
            url: 'https://docs.google.com/spreadsheets/d/1YwW-eVtYsGIoM5xgfkAAbFu2NQ3ZJgL06qx2_hYALK8/edit?usp=sharing',
          }}
          originModule="personnel"
        />
      </Card>
    </>
  );
};

export default ImportReportForce;
