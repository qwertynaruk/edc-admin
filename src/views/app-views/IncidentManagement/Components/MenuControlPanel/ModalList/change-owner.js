import { Button, Form, Modal, Space, Spin, Typography } from 'antd';
import PersonnelSelectWidget from 'components/shared-components/PersonnelSelectWidget';
import _ from 'lodash';
import { observer } from 'mobx-react';
import ReportStore from 'mobx/ReportStore';
import { useState } from 'react';

const ChangeOwner = ({ visible, setVisible }) => {
  const { reportItems } = ReportStore;
  const reportId = _.get(reportItems, '_id', '-');

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [eventChange, setEventChange] = useState(false);

  const onFinishForm = (values) => {
    setLoading(true);
    ReportStore.updateReport(values, reportId)
      .then(() => setVisible(false))
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      title="เปลี่ยนผู้รับผิดชอบ"
      visible={visible}
      centered={true}
      forceRender
      onCancel={() => {
        setVisible(false);
        form.resetFields();
      }}
      closeIcon
      width={860}
      footer={null}
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={onFinishForm} onValuesChange={() => setEventChange(true)}>
          <Space direction="vertical" className="gx-full-width" size={20}>
            <Space>
              <Typography.Text style={{ color: '#ffffff66' }}>เจ้าของรายงาน :</Typography.Text>
              <Typography.Text>
                <PersonnelSelectWidget
                  viewMode={{ enable: true, values: _.get(reportItems, 'report_responsible_id', '') }}
                />
              </Typography.Text>
            </Space>

            <Form.Item
              label="เลือกเจ้าหน้าที่"
              name="report_responsible_id"
              rules={[
                {
                  required: true,
                  message: 'กรุณาเลือกเจ้าหน้าที่',
                },
              ]}
            >
              <PersonnelSelectWidget showSearch placeholder="เลือกเจ้าหน้าที่" />
            </Form.Item>

            <Space className="gx-full-width gx-flex-end">
              <Button disabled={!eventChange} type="primary" onClick={() => form.submit()}>
                บันทึก
              </Button>
            </Space>
          </Space>
        </Form>
      </Spin>
    </Modal>
  );
};

export default observer(ChangeOwner);
