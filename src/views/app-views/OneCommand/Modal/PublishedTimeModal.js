import { Button, Col, Form, Modal, Row } from 'antd';
import DatePicker from 'components/shared-components/DatePicker';
import { observer } from 'mobx-react';
import MassNotificationStore from 'mobx/MassNotificationStore';
import { useEffect } from 'react';
import styled from '@emotion/styled';
import moment from 'moment';

const FixFormItem = styled(Form.Item)`
  flex-direction: column !important;
  align-items: flex-start !important;
  .ant-form-item-control {
    width: 100%;
  }
`;

const PublishedTimeModal = (props) => {
  const { visible, setVisible, form, record } = props;

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (!record) return;
    if (!record?.publish_time) {
      form.setFieldsValue(record);
      return;
    }
    form.setFieldsValue({ publish_time: moment.utc(record.publish_time) });
  }, [form, record, visible]);
  return (
    <>
      <Modal
        title="กำหนดเวลาเผยแพร่"
        visible={visible}
        onOk={handleOk}
        centered
        width={600}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
      >
        <Row>
          <Col span={24}>
            <FixFormItem
              className="gx-m-0 gx-full-width"
              label="เลือกวันที่และเวลาที่ต้องการเผยแพร่"
              name="publish_time"
              rules={[
                {
                  required: true,
                  message: 'กรุณาเลือกวันที่และเวลาที่ต้องการเผยแพร่',
                },
              ]}
            >
              <DatePicker showTime={{ format: 'HH:mm' }} className="gx-full-width" placeholder="เลือกวันที่" />
            </FixFormItem>
          </Col>

          <Col className="gx-mt-3" span="24" align="end">
            <Button className="gx-mr-2" onClick={handleCancel}>
              ยกเลิก
            </Button>
            <Button onClick={handleOk} type="primary" loading={MassNotificationStore.actionLoading}>
              บันทึก
            </Button>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default observer(PublishedTimeModal);
