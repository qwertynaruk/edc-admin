import { Button, Col, Modal, Typography } from 'antd';

const CanclePublish = ({ visible, setVisible, onConfirm }) => {
  const handleOk = () => {
    onConfirm();
    setVisible(false);
  };
  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Modal visible={visible} centered onCancel={handleCancel} footer={null}>
        <Typography.Title level={5}>ยกเลิกวันเผยแพร่ที่กำหนดเวลาไว้หรือไม่</Typography.Title>
        <p>หากยกเลิก ข้อความของคุณจะย้ายไปยัง ฉบับร่าง และไม่ได้รับการเผยแพร่</p>
        <Col className="gx-mt-3" span="24" align="end">
          <Button className="gx-mr-2" onClick={handleCancel}>
            ยกเลิก
          </Button>
          <Button onClick={handleOk} type="primary">
            ยกเลิกกำหนดเวลา
          </Button>
        </Col>
      </Modal>
    </>
  );
};

export default CanclePublish;
