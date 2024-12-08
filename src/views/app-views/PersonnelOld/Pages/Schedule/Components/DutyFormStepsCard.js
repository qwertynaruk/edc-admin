import { Card, Steps } from 'antd';
import { clamp } from 'lodash';

const { Step } = Steps;

const DutyFormStepsCard = (props) => {
  const { step = 0, person = false } = props;
  if (person) {
    return (
      <Card>
        <Steps size="small" current={clamp(step - 2, 0, 1)}>
          <Step title="ลงตารางปฎิบัติงาน" />
          <Step title="ตรวจสอบข้อมูล" />
        </Steps>
      </Card>
    );
  }
  return (
    <Card>
      <Steps size="small" current={clamp(step - 1, 0, 2)}>
        <Step title="เลือกเจ้าหน้าที่" />
        <Step title="ลงตารางปฎิบัติงาน" />
        <Step title="ตรวจสอบข้อมูล" />
      </Steps>
    </Card>
  );
};

export default DutyFormStepsCard;
