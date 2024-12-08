import { Button } from 'antd';
import ReportApprovalModal from 'components/shared-components/Modals/Approval/ReportApprovalModal';
import _ from 'lodash';
import { observer } from 'mobx-react';
import ReportStore from 'mobx/ReportStore';
import UserStore from 'mobx/UserStore';
import { useEffect } from 'react';

function ReportApproval({ itemId, pdfAccess, controls = [false, () => {}] }) {
  const { reportItems } = ReportStore;
  const [visibleApproveRequestModal, setVisibleApproveRequestModal] = controls;

  const approvePermis = !!_.chain(_.get(reportItems, 'inspectors', []))
    .flatMap((item) => item.inspector_id)
    .uniq()
    .find((item) => item === UserStore.user.personnel_id)
    .value();

  const submitStatus = _.get(reportItems, 'submit_status');

  const isShowApproveRequest = () => {
    if (!pdfAccess) {
      return false;
    }
    if (approvePermis) {
      const approvalStatus = _.get(reportItems, 'submit_status');
      if (approvalStatus === 'อนุมัติ' || approvalStatus === 'ไม่ผ่าน' || !approvalStatus) {
        return false;
      }
      return true;
    }
    return true;
  };

  const isShowRequestApproval = isShowApproveRequest() && ['', 'ไม่ผ่าน', 'ยังไม่ร้องขอ'].includes(submitStatus);
  const isShowAprrove = isShowApproveRequest() && ['ส่งคำร้อง'].includes(submitStatus) && approvePermis;

  const onFinish = (values) => {
    return ReportStore.createReviews(values).then(() => {
      return ReportStore.getReportItems(itemId);
    });
  };

  useEffect(() => {
    if (!visibleApproveRequestModal) {
      return;
    }
    ReportStore.getReviews(itemId);
  }, [itemId, visibleApproveRequestModal]);

  return (
    <>
      {isShowRequestApproval ? (
        <Button ghost onClick={() => setVisibleApproveRequestModal(true)}>
          ขออนุมัติ
        </Button>
      ) : null}
      {isShowAprrove ? (
        <Button ghost onClick={() => setVisibleApproveRequestModal(true)}>
          ตรวจสอบคำขออนุมัติ
        </Button>
      ) : null}
      {visibleApproveRequestModal && (
        <ReportApprovalModal
          visible={visibleApproveRequestModal}
          setVisible={setVisibleApproveRequestModal}
          onFinish={onFinish}
          submitStatus={_.get(ReportStore, 'reportItem.submit_status')}
          history={_.get(ReportStore, 'reviewsList', [])}
          approvePermis={approvePermis}
        />
      )}
    </>
  );
}

export default observer(ReportApproval);
