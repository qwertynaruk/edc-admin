import { Card, Empty } from 'antd';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';

const CheckingCondition = ({ history }) => {
  return (
    <>
      <PageBreadcrumb
        history={history}
        pageLabel={{ master: 'ตั้งค่า', subpath: 'เงื่อนไขการตรวจสอบ' }}
      ></PageBreadcrumb>
      <Card>
        <Empty />
      </Card>
    </>
  );
};

export default CheckingCondition;
