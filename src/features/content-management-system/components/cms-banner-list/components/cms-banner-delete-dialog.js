import { Modal, Typography } from 'antd';

import { useDeleteCmsBanner } from '../../../api/delete-cms-banner';

export const CmsBannerDeleteDialog = ({ open, onClose, data }) => {
  const deleteCmsBanner = useDeleteCmsBanner({
    onSuccess: onClose,
  });

  return (
    <Modal
      title="คุณต้องการลบแบนเนอร์นี้ใช่หรือไม่?"
      visible={open}
      onCancel={onClose}
      okButtonProps={{
        type: 'danger',
        loading: deleteCmsBanner.isLoading,
      }}
      centered
      onOk={() => deleteCmsBanner.submit(data._id)}
    >
      <Typography.Text>หากลบแบนเนอร์นี้แล้ว จะไม่สามารถกู้คืนได้</Typography.Text>
    </Modal>
  );
};
