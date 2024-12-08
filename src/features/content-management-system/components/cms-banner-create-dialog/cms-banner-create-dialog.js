import { Button, Modal, Typography } from 'antd';
import { ContentCreatorIcon, LinkEmbedIcon } from '../../icons';
import { useLocation, useNavigate } from 'react-router-dom';

import { css } from '@emotion/css';

export const CmsBannerCreateDialog = ({ visible, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleCreateContent = (type) => {
    navigate(`${location.pathname}/create?type=${type}`);
  };

  return (
    <Modal title="เลือกประเภทของแบนเนอร์" visible={visible} centered width={450} onCancel={onClose} footer={null}>
      <div
        className={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;

          button {
            width: 180px;
            height: 210px;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 25px;

            border: 2px dashed #d9d9d9 !important;
            background-color: transparent !important;

            :hover {
              background-color: rgba(0, 0, 0, 0.5) !important;
            }
          }

          button > svg {
            width: 65px;
            height: 65px;
          }
        `}
      >
        <Button onClick={() => handleCreateContent('content')}>
          <ContentCreatorIcon width={30} height={30} />
          <Typography.Text>สร้างเนื้อหา</Typography.Text>
        </Button>
        <Button onClick={() => handleCreateContent('link')}>
          <LinkEmbedIcon width={30} height={30} />
          <Typography.Text>ฝั่งลิงค์</Typography.Text>
        </Button>
      </div>
    </Modal>
  );
};
