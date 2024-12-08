import { Empty, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { css } from '@emotion/css';

const ModalImage = (props) => {
  const { isModalImageOpen, handleImageCancel, imageUrl } = props;

  const [status, setStatus] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const imgTypeRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <>
      <Modal
        visible={isModalImageOpen}
        onOk={handleImageCancel}
        onCancel={handleImageCancel}
        bodyStyle={{ maxHeight: 1000 }}
        centered
        className={css`
          .ant-modal-footer .ant-btn + .ant-btn:not(.ant-dropdown-trigger) {
            margin-bottom: 0;
            margin-left: 0;
            display: none;
          }
        `}
        width={windowDimensions.width - 400}
      >
        <Empty
          style={{
            display: status ? 'inline-block' : 'none',
          }}
        />
        <div
          style={{
            display: !status ? 'inline-block' : 'none',
            width: '100%',
          }}
        >
          <img
            ref={imgTypeRef}
            src={imageUrl}
            alt="Image"
            onError={() => setStatus(true)}
            onLoad={() => setStatus(false)}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              // maxHeight: 1000,
              // maxWidth: 1000,
              // minWidth: 500,
              // height: "auto",
            }}
            // style="object-fit:cover;
            // width:200px;
            // height:300px;
            // border: solid 1px #CCC"
          />
        </div>
      </Modal>
    </>
  );
};

export default ModalImage;
