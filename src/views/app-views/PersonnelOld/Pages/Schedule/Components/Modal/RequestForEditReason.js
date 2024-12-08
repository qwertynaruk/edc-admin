import { Button, Input, Modal, Space, Typography } from 'antd';

import { InfoCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';

const RequestForEditReason = (props) => {
  const { visible, onOk, onCancel } = props;
  const [text, setText] = useState(null);

  return (
    <Modal
      centered
      visible={visible}
      width={700}
      footer={null}
      onCancel={onCancel}
      closable={false}
      maskClosable={false}
      bodyStyle={{ backgroundColor: '#1c2536' }}
    >
      <Space className="gx-space-full-width" direction="vertical" align="center" size={15}>
        <InfoCircleOutlined style={{ color: 'rgba(247, 187, 134, 1)', fontSize: 60 }} />
        <Space direction="vertical">
          <Typography.Text strong>บันทึกการแก้ไข</Typography.Text>
          <Typography.Text strong>ข้อมูลตารางปฏิบัติเจ้าหน้าที่</Typography.Text>
        </Space>

        <Typography.Text>กรุณาระบุเหตุผลในการแก้ไขข้อมูล</Typography.Text>

        <Input.TextArea
          rows={6}
          onChange={(event) => {
            setText(event.target.value);
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Space style={{ display: 'flex' }}>
            <Button onClick={onCancel}>ยกเลิก</Button>
            <Button onClick={() => onOk(text)} type="primary" loading={props.actionLoading}>
              ตกลง
            </Button>
          </Space>
        </div>
      </Space>
    </Modal>
  );
};

export default RequestForEditReason;
