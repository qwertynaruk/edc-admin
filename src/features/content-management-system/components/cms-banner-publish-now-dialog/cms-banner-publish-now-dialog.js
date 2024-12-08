import { Button, Modal, Typography } from 'antd';

import Flex from 'components/shared-components/Flex';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export const CmsBannerPublishNowDialog = ({ open, onClose, okButtonProps }) => {
  return (
    <Modal centered width={400} visible={open} onCancel={onClose} footer={null}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          marginBottom: 48,
        }}
      >
        <ExclamationCircleOutlined style={{ fontSize: 50, color: '#ea8e50' }} />
        <Typography.Title level={4} className="gx-mb-0">
          แจ้งเตือน
        </Typography.Title>
        <Typography.Text>ท่านต้องการเผยแพร่แบนเนอร์หรือไม่</Typography.Text>
      </div>
      <Flex justifyContent="center">
        <Button
          onClick={onClose}
          style={{
            width: 125,
          }}
        >
          ยกเลิก
        </Button>
        <Button
          type="primary"
          style={{
            width: 125,
          }}
          {...okButtonProps}
        >
          ยืนยัน
        </Button>
      </Flex>
    </Modal>
  );
};
