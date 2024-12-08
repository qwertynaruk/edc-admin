import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import DialogNotification from 'components/shared-components/DialogNotification';
import produce from 'immer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonnelService from 'services/PersonelService';
import { transformScheduleFormIntoPayload } from 'utils/dataTranformer';
import DutyFormContainer from '../../Components/DutyFormContainer';

const CreateSchedulePerson = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    actionLoading: false,
  });

  const onFinish = (values) => {
    const payload = transformScheduleFormIntoPayload(values, 'บุคลากร');

    setState(
      produce((draft) => {
        draft.actionLoading = true;
      })
    );
    PersonnelService.createDuty(payload)
      .then((resp) => {
        DialogNotification('success', 'สร้างตารางปฏิบัติหน้าที่สำเร็จ');
        navigate(`../../${resp.data._id}`, { replace: true });
      })
      .catch(() => {
        DialogNotification('error', 'สร้างตารางปฏิบัติหน้าที่ไม่สำเร็จ');
      })
      .finally(() => {
        setState(
          produce((draft) => {
            draft.actionLoading = false;
          })
        );
      });
  };

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'ตารางปฏิบัติหน้าที่', subpath: 'เพิ่ม' }} />
      <DutyFormContainer person onFinish={onFinish} actionLoading={state.actionLoading} />
    </>
  );
};

export default CreateSchedulePerson;
