import { Button, Card, Form, Space, Spin, Typography } from 'antd';
import Guarded from 'components/shared-components/Guarded';
import WYSIWYGV2 from 'components/shared-components/WYSIWYGV2';
import _ from 'lodash';
import ReportStore from 'mobx/ReportStore';
import { useState } from 'react';

const { Text } = Typography;

const DocumentFooter = ({ iRef, guardedProps = null }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [eventChange, setEventChange] = useState(false);

  const { reportItems } = ReportStore;
  const reportId = _.get(reportItems, '_id', '-');
  const reportExported = _.get(reportItems, 'is_exported', false);

  const finishForm = (values) => {
    setLoading(true);
    ReportStore.updateReport(values, reportId).finally(() => setLoading(false));
  };

  return (
    <Card ref={(el) => (iRef.current['ส่วนท้ายเอกสาร'] = el)}>
      <Text strong>ส่วนท้ายเอกสาร</Text>

      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={finishForm}
          onValuesChange={() => setEventChange(true)}
          disabled={reportExported}
        >
          <div className="gx-my-4">
            <Form.Item name="content" initialValue={_.get(reportItems, 'content', '')}>
              <WYSIWYGV2 readOnly={reportExported} />
            </Form.Item>
          </div>

          <Guarded {...guardedProps}>
            <Space className="gx-full-width gx-flex-end">
              <Button
                disabled={!eventChange}
                type="primary"
                htmlType="submit"
                data-testid="document-footer-button-submit"
              >
                บันทึกข้อมูล
              </Button>
            </Space>
          </Guarded>
        </Form>
      </Spin>
    </Card>
  );
};

export default DocumentFooter;
