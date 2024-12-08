import { Alert, Button, Card, Space, Typography } from 'antd';
import { GuardHandles } from 'components/shared-components/Guarded';
import _ from 'lodash';
import ReportStore from 'mobx/ReportStore';
import { useEffect, useState } from 'react';

const { Text } = Typography;

const InspectionConfirmation = ({
  iRef,
  reportTypeName,
  formRequiredField,
  formDataAcceptInConditionAll,
  setStepCurrent = () => {},
  setFormRequiredField = () => {},
  guardedProps = null,
}) => {
  const { reportItems } = ReportStore;
  const canUpdate = GuardHandles(guardedProps);
  const reportExported = _.get(reportItems, 'is_exported', false);
  const [clickEvent, setClickEvent] = useState(false);

  useEffect(() => {
    if (formDataAcceptInConditionAll && clickEvent) {
      setClickEvent(false);
      // onInitCondition();
      setStepCurrent(1);
    }
  }, [formDataAcceptInConditionAll, clickEvent]);

  // const checkDialog = ({
  //   propertyList = [],
  //   evidenceAccountList = [],
  //   offenderDetail = [],
  //   officerArrestUnit = [],
  //   investigatorUnit = [],
  //   onProcess = () => {},
  // }) => {
  //   if (propertyList && propertyList.length <= 0) {
  //     DialogNotification('warning', 'กรุณาเพิ่มทรัพย์สินอย่างน้อย 1 รายการ');
  //   } else if (evidenceAccountList && evidenceAccountList.length <= 0) {
  //     DialogNotification('warning', 'กรุณาเพิ่มบัญชีของกลางก่อนทำรายการ');
  //   } else if (offenderDetail && offenderDetail.length <= 0) {
  //     DialogNotification('warning', 'กรุณาเพิ่มผู้ต้องหาก่อนทำรายการ');
  //   } else if (officerArrestUnit && officerArrestUnit.length <= 0) {
  //     DialogNotification('warning', 'กรุณาเพิ่มเจ้าหน้าที่ชุดจับกุมอย่างน้อย 1 รายการ');
  //   } else if (investigatorUnit && investigatorUnit.length <= 0) {
  //     DialogNotification('warning', 'กรุณาเพิ่มเจ้าหน้าที่สืบสวนอย่างน้อย 1 รายการ');
  //   } else {
  //     onProcess();
  //   }
  // };

  // const onInitCondition = () => {
  //   switch (reportTypeName) {
  //     case 'ประจำวันเกี่ยวกับคดีอาญา':
  //       handleVerifyCrimeFormType(() => setStepCurrent(1));
  //       break;

  //     case 'ประจำวันเกี่ยวกับคดีจราจร':
  //       handleVerifyCrimeFormType(() => setStepCurrent(1));
  //       break;

  //     case 'รายงานการจับกุม':
  //       handleVerifyArrestFormType(() => setStepCurrent(1), false);
  //       break;

  //     case 'รายงานการจับกุม (เยาวชน)':
  //       handleVerifyArrestFormType(() => setStepCurrent(1), false);
  //       break;

  //     case 'รายงานการสืบสวน':
  //       handleVerifyInvestigatorFormType(() => setStepCurrent(1), false);
  //       break;

  //     default:
  //       setStepCurrent(1);
  //       break;
  //   }
  // };

  // const handleVerifyCrimeFormType = (onProcess) => {
  //   const { offense } = reportItems;
  //   const evidenceAccountList = _.get(offense, 'evidence_account', []);
  //   const propertyList = _.get(offense, 'property', []);
  //   const propertyIncustodyList = propertyList.filter((ss) => ss?.police_custody === 'ใช่');

  //   checkDialog({
  //     evidenceAccountList:
  //       evidenceAccountList.length > 0 && propertyIncustodyList.length > 0 ? null : propertyList.length > 0 ? [] : null,
  //     offenderDetail: null,
  //     officerArrestUnit: null,
  //     investigatorUnit: null,
  //     onProcess,
  //   });
  // };

  // const handleVerifyArrestFormType = (onProcess) => {
  //   const { arrest } = reportItems;
  //   const offenderDetail = _.get(arrest, 'offender', []);
  //   const internalArrestUnit = _.get(arrest, 'internal_arrest_unit', {});
  //   const externalArrestUnit = _.get(arrest, 'external_arrest_unit', []);

  //   checkDialog({
  //     evidenceAccountList: null,
  //     offenderDetail,
  //     officerArrestUnit: _.keys(internalArrestUnit).length > 0 || externalArrestUnit.length > 0,
  //     investigatorUnit: null,
  //     onProcess,
  //   });
  // };

  // const handleVerifyInvestigatorFormType = (onProcess) => {
  //   const { investigation } = reportItems;
  //   const investigatorUnit = _.get(investigation, 'investigator', []);

  //   checkDialog({
  //     evidenceAccountList: null,
  //     offenderDetail: null,
  //     officerArrestUnit: null,
  //     investigatorUnit,
  //     onProcess,
  //   });
  // };

  const onCheckCondition = () => {
    if (!canUpdate) {
      return;
    }
    setFormRequiredField(true);
    setClickEvent(true);
  };

  return (
    <Card ref={(el) => (iRef.current['ตรวจสอบข้อมูล'] = el)}>
      <Text strong>ตรวจสอบข้อมูล</Text>

      <Space direction="vertical" className="gx-mt-4">
        <Button type="primary" onClick={onCheckCondition} disabled={reportExported || !canUpdate}>
          ส่งรายงาน
        </Button>

        {formRequiredField && !formDataAcceptInConditionAll ? (
          <Alert
            message="กรุณาตรวจสอบข้อมูลให้ครบ ก่อนทำรายการ"
            type="warning"
            showIcon
            style={{ width: 'max-content' }}
          />
        ) : null}
      </Space>
    </Card>
  );
};

export default InspectionConfirmation;
