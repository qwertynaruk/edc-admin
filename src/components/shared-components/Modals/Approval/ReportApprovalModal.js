import produce from 'immer';
import { observer } from 'mobx-react';
import Approval from './Approval';

const ReportApprovalModal = (props) => {
  const rejectRequest = ({ form, onFinishForm }) => {
    form
      .validateFields()
      .then((values) => {
        onFinishForm(
          produce(values, (draft) => {
            draft.status = 'review';
            draft.submit_status = 'ไม่ผ่าน';
          })
        );
      })
      .catch((error) => {
        console.debug('🚀 ~ file: ReportApprovalModal.js:18 ~ rejectRequest ~ error', error);
        return error;
      });
  };

  const approveRequest = ({ form, onFinishForm }) => {
    form
      .validateFields()
      .then((values) => {
        onFinishForm(
          produce(values, (draft) => {
            draft.status = 'review';
            draft.submit_status = 'อนุมัติ';
          })
        );
      })
      .catch((error) => {
        console.debug('🚀 ~ file: ReportApprovalModal.js:35 ~ approveRequest ~ error', error);
        return error;
      });
  };

  const request = ({ form, onFinishForm }) => {
    form
      .validateFields()
      .then((values) => {
        onFinishForm(
          produce(values, (draft) => {
            draft.status = 'request';
            draft.submit_status = 'ส่งคำร้อง';
          }),
          false
        );
      })
      .catch((error) => {
        console.debug('🚀 ~ file: ReportApprovalModal.js:53 ~ request ~ error', error);
        return error;
      });
  };

  return <Approval rejectRequest={rejectRequest} approveRequest={approveRequest} request={request} {...props} />;
};

export default observer(ReportApprovalModal);
