import { Button, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import DialogNotification from 'components/shared-components/DialogNotification';
import ReportStore from 'mobx/ReportStore';
import { useState } from 'react';
import FormPreference from 'utils/FormPreference';

const CaseNumberModal = ({
  visible = false,
  setVisible = () => {},
  onSelected = () => {},
  onValuesChange = () => {},
  caseType,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinishForm = (values) => {
    setLoading(true);
    onValuesChange();
    ReportStore.verifyCaseNumber({
      case_id: values?.number,
      case_year: values?.year,
      case_type: caseType,
    })
      .then((resp) => {
        if (resp) {
          throw new Error();
        }
        onSelected(values);
        onExitModal();
      })
      .catch(() => DialogNotification('error', 'ไม่สามารถใช้เลขนี้ได้', 'เนื่องจากเลขคดีซ้ำกับในระบบ'))
      .finally(() => setLoading(false));
  };

  const onExitModal = () => {
    form.resetFields();
    setVisible(false);
  };

  return (
    <Modal
      visible={visible}
      title="หมายเลขคดี"
      width={600}
      centered
      style={{ marginTop: 15 }}
      onCancel={onExitModal}
      footer={
        <>
          <Button onClick={onExitModal}>ยกเลิก</Button>
          <Button loading={loading} type="primary" onClick={() => form.submit()}>
            บันทึก
          </Button>
        </>
      }
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={onFinishForm}>
          <Row className="gx-flex-row">
            <Col span={12}>
              <Form.Item
                name="number"
                label="เลขคดี"
                rules={[
                  { required: true, message: 'กรุณากรอกเลขคดี' },
                  () => ({
                    validator(_, value) {
                      if (/^[0-9]*$/.test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('กรุณากรอกเป็นตัวเลขเท่านั้น'));
                    },
                  }),
                ]}
              >
                <Input placeholder="กรอกเลขคดี" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="year" label="ปีคดี" rules={[{ required: true, message: 'กรุณาเลือกปีคดี' }]}>
                <Select placeholder="เลือกปีคดี">{FormPreference.RenderYearList()}</Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default CaseNumberModal;
