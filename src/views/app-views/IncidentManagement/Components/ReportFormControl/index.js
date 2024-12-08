import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { Spin } from 'antd';

import ReportStore from 'mobx/ReportStore';
import BasicInformation from './CardForm/basic-information';
import CommentOpinion from './CardForm/comment-opinion';
import InspectionConfirmation from './CardForm/inspection-confirmation';
import DocumentFooter from './CardForm/document-footer';
import Erroneousness from './CardForm/Erroneousness';
import Incidence from './CardForm/Incidence';
import Arresting from './CardForm/Arresting';
import InspectionVerifyPrint from './CardForm/inspection-verify-print';
import IncidenceAnnounce from './CardForm/IncidenceAnnounce';
import Investigation from './CardForm/Investigation';
import AttachmentFile from './CardForm/attachment-file';

const ReportFormControl = ({
  setStepCurrent = () => {},
  loading = false,
  sideMenuCurrent,
  reportTypeName,
  guardedProps,
}) => {
  const { reportItems = {} } = ReportStore;
  const itemsRef = useRef([]);
  const [menuStack, setMenuStack] = useState([]);
  const [formRequiredField, setFormRequiredField] = useState(false);
  const [formDataAcceptInConditionAll, setFormDataAcceptInConditionAll] = useState(false);

  useEffect(() => {
    const _tx = _.get(reportItems, 'departments', []).map((ss) => ss.name);
    setMenuStack(_tx);
  }, [loading, reportItems]);

  useEffect(() => {
    if (itemsRef.current[sideMenuCurrent.key]) {
      itemsRef.current[sideMenuCurrent.key].scrollIntoView({ behavior: 'smooth' });
    }
  }, [sideMenuCurrent]);

  return (
    <>
      <Spin spinning={loading}>
        {menuStack.includes('ข้อมูลพื้นฐานการแจ้งเหตุ') && (
          <BasicInformation
            iRef={itemsRef}
            formRequiredField={formRequiredField}
            setFormRequiredField={setFormRequiredField}
            setFormDataAcceptInConditionAll={setFormDataAcceptInConditionAll}
            guardedProps={guardedProps}
          />
        )}

        {menuStack.includes('เหตุการณ์') && <Incidence iRef={itemsRef} guardedProps={guardedProps} />}

        {menuStack.includes('ความผิด') && <Erroneousness iRef={itemsRef} guardedProps={guardedProps} />}

        {menuStack.includes('การสืบสวน') && (
          <Investigation
            iRef={itemsRef}
            formRequiredField={formRequiredField}
            setFormRequiredField={setFormRequiredField}
            setFormDataAcceptInConditionAll={setFormDataAcceptInConditionAll}
            guardedProps={guardedProps}
          />
        )}

        {menuStack.includes('การจับกุม') && (
          <Arresting
            iRef={itemsRef}
            formRequiredField={formRequiredField}
            setFormRequiredField={setFormRequiredField}
            setFormDataAcceptInConditionAll={setFormDataAcceptInConditionAll}
            juvenile={reportTypeName === 'รายงานการจับกุม (เยาวชน)'}
            guardedProps={guardedProps}
          />
        )}

        {menuStack.includes('การแจ้งเหตุ') && <IncidenceAnnounce iRef={itemsRef} guardedProps={guardedProps} />}

        {menuStack.includes('ส่วนท้ายเอกสาร') && <DocumentFooter iRef={itemsRef} guardedProps={guardedProps} />}

        {menuStack.includes('เอกสารแนบ') && <AttachmentFile iRef={itemsRef} guardedProps={guardedProps} />}

        {menuStack.includes('ตรวจสอบข้อมูล') && (
          <InspectionConfirmation
            iRef={itemsRef}
            reportTypeName={reportTypeName}
            formRequiredField={formRequiredField}
            formDataAcceptInConditionAll={formDataAcceptInConditionAll}
            setStepCurrent={setStepCurrent}
            setFormRequiredField={setFormRequiredField}
            guardedProps={guardedProps}
          />
        )}

        {menuStack.includes('ตรวจสอบรายงานและพิมพ์เอกสาร') && (
          <InspectionVerifyPrint iRef={itemsRef} setStepCurrent={setStepCurrent} />
        )}

        {menuStack.includes('แสดงความคิดเห็น') && <CommentOpinion iRef={itemsRef} />}
      </Spin>
    </>
  );
};

export default observer(ReportFormControl);
