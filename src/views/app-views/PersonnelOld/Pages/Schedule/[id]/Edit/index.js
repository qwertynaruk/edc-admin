import { Card } from 'antd';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import DialogNotification from 'components/shared-components/DialogNotification';
import useDuty from 'hooks/services/useDuty';
import produce from 'immer';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PersonnelService from 'services/PersonelService';
import { transformScheduleFormIntoPayload, transfromPayloadIntoUpdatePayload } from 'utils/dataTranformer';
import DutyFormContainer from '../../Components/DutyFormContainer';

const EditSchedule = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: duty, loading } = useDuty({ params: { duty_id: id } });
  const [state, setState] = useState({
    actionLoading: false,
  });

  const onFinish = (values) => {
    setState(
      produce((draft) => {
        draft.actionLoading = true;
      })
    );
    PersonnelService.updateDuty(transfromPayloadIntoUpdatePayload(transformScheduleFormIntoPayload(values), duty))
      .then(() => {
        DialogNotification('success', 'แก้ไขตารางปฏิบัติหน้าที่สำเร็จ');
        navigate(`../`, { replace: true });
      })
      .catch(() => {
        DialogNotification('error', 'แก้ไขตารางปฏิบัติหน้าที่ไม่สำเร็จ');
      })
      .finally(() => {
        setState(
          produce((draft) => {
            draft.actionLoading = false;
          })
        );
      });
  };

  const person = useMemo(() => {
    if (!duty) return false;
    return duty.type === 'บุคลากร';
  }, [duty]);

  if (loading) return <Card loading={loading} />;

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'ตารางปฏิบัติหน้าที่', subpath: 'แก้ไข' }} />
      <DutyFormContainer edit person={person} record={duty} onFinish={onFinish} actionLoading={state.actionLoading} />
    </>
  );
};

export default EditSchedule;
