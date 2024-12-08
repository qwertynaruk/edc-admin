import { Card, Steps } from 'antd';
import DialogPopup from 'components/shared-components/DialogPopup';

const FormStepNavigation = ({ stepCurrent, setStepCurrent }) => {
  const onChangeStepNavigate = (_target) => {
    if (_target === 0) {
      if (stepCurrent === 1) {
        DialogPopup.confirm({
          title: 'ยืนยันการย้อนกลับการกระทำ',
          text: 'ท่านต้องการยืนยันการย้อนกลับการกระทำใช่หรือไม่',
          confirmAction: () => {
            setStepCurrent(0);
          },
        });
      } else {
        setStepCurrent(0);
      }
    }

    return null;
  };

  return (
    <Card bodyStyle={{ padding: 5 }}>
      <Steps current={stepCurrent} style={{ padding: '15px 20px' }} onChange={onChangeStepNavigate}>
        <Steps.Step title="กรอกข้อมูลเบื้องต้น" />
        <Steps.Step title="ตรวจสอบเอกสาร" />
        <Steps.Step title="พิมพ์เอกสาร" />
      </Steps>
    </Card>
  );
};

export default FormStepNavigation;
