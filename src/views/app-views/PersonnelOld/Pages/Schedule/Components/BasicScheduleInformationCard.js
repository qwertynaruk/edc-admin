import { Card, Space, Typography } from 'antd';
import DepartmentSelectWidget from 'components/shared-components/DepartmentSelectWidget';
import LabelShowText from 'components/shared-components/LabelShowText';
import _ from 'lodash';
import { renderDate } from 'utils/stringRender';

const { Title } = Typography;

const BasicScheduleInformationCard = (props) => {
  const { record } = props;

  const getDepartment = () => {
    const departmentIds = _.get(record, 'department_ids');
    if (departmentIds) {
      return <DepartmentSelectWidget viewMode value={departmentIds} />;
    }
    if (_.get(record, 'department[0].name')) {
      return _.get(record, 'department[0].name');
    }
    return '-';
  };
  return (
    <Card>
      <Title level={5}>ข้อมูลตารางปฏิบัติหน้าที่</Title>
      <LabelShowText labelText="ชื่อตารางปฏิบัติหน้าที่" value={_.get(record, 'duty_name', '-')} />
      <LabelShowText labelText="ฝ่ายงาน" value={getDepartment()} />
      <Space>
        <LabelShowText
          labelText="วันที่เริ่มถึงวันที่สิ้นสุดปฏิบัติหน้าที่"
          value={renderDate(_.get(record, 'date.0'))}
        />
        <LabelShowText labelText="ถึง" value={renderDate(_.get(record, 'date.1'))} />
      </Space>
    </Card>
  );
};

export default BasicScheduleInformationCard;
