import { useEffect, useState } from 'react';
import _ from 'lodash';
import { Button, Card, Col, Form, Input, Row, Space, Typography } from 'antd';
import DatePicker from 'components/shared-components/DatePicker';
import DatePickerISOHoC from 'components/shared-components/DatePickerISOHoC';
import WYSIWYGV2 from 'components/shared-components/WYSIWYGV2';
import ReportStore from 'mobx/ReportStore';
import InsideArrestTeam from '../Arresting/InsideArrestTeam';
import Guarded from 'components/shared-components/Guarded';

const { Text } = Typography;

const Investigation = ({
  iRef,
  formRequiredField,
  setFormRequiredField = () => {},
  setFormDataAcceptInConditionAll = () => {},
  guardedProps = null,
}) => {
  const [form] = Form.useForm();
  const { reportItems } = ReportStore;
  const reportId = _.get(reportItems, '_id', '-');
  const reportExported = _.get(reportItems, 'is_exported', false);

  const [eventChange, setEventChange] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const forceData = _.get(reportItems, 'investigation', {});

    form.setFieldsValue(forceData);
  }, []);

  useEffect(() => {
    if (formRequiredField) {
      form.submit();
    }
  }, [formRequiredField]);

  const finishForm = (values) => {
    if (formRequiredField) {
      setFormDataAcceptInConditionAll(true);
    } else {
      doServicesApply(values);
    }
  };

  const doServicesApply = (values) => {
    setFormLoading(true);

    ReportStore.updateReport(
      {
        investigation: values,
      },
      reportId
    )
      .then(() => setEventChange(false))
      .finally(() => setFormLoading(false));
  };

  const onHandleValuesChange = () => {
    setEventChange(true);
    setFormRequiredField(false);
  };

  return (
    <>
      <Card ref={(el) => (iRef.current['การสืบสวน'] = el)}>
        <Text strong>การสืบสวน</Text>
        <Form
          form={form}
          layout="vertical"
          onFinish={finishForm}
          onValuesChange={onHandleValuesChange}
          disabled={reportExported}
        >
          <Card className="gx-mt-4">
            <Text strong>ส่วนหัวบันทึกข้อความ</Text>
            <Row className="gx-flex-row gx-mt-4" gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  name={['header', 'government_sector']}
                  label="ส่วนราชการ"
                  rules={[{ required: true, message: 'กรุณากรอกส่วนราชการ' }]}
                >
                  <Input placeholder="กรอกส่วนราชการ" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name={['header', 'government_sector_phone_number']}
                  label="เบอร์โทรส่วนงานราชการ"
                  rules={[{ required: true, message: 'กรุณากรอกเบอร์โทรส่วนงานราชการ' }]}
                >
                  <Input placeholder="กรอกเบอร์โทรส่วนงานราชการ" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name={['header', 'order']}
                  label="เลขที่"
                  rules={[{ required: true, message: 'กรุณากรอกเลขที่' }]}
                >
                  <Input placeholder="กรอกเลขที่" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name={['header', 'datetime']}
                  label="วันที่"
                  rules={[{ required: true, message: 'กรุณาเลือกวันที่' }]}
                >
                  <DatePickerISOHoC>
                    <DatePicker className="gx-full-width" placeholder="เลือกวันที่" />
                  </DatePickerISOHoC>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name={['header', 'topic']}
                  label="เรื่อง"
                  rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]}
                >
                  <Input placeholder="กรอกข้อมูล" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name={['header', 'inform']}
                  label="เรียน"
                  rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]}
                >
                  <Input placeholder="กรอกข้อมูล" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card>
            <Form.Item
              name="beginning"
              label={<Text strong>๑.จุดเริ่มต้นของการสืบสวน</Text>}
              className="gx-mb-0"
              rules={[{ required: true, message: 'กรุณาระบุรายละเอียด' }]}
              initialValue={_.get(reportItems, 'investigation.beginning', '')}
            >
              <WYSIWYGV2 readOnly={reportExported} />
            </Form.Item>
          </Card>

          <Card>
            <Form.Item
              name="conducting"
              label={<Text strong>๒.การดำเนินการการสืบสวน</Text>}
              className="gx-mb-0"
              rules={[{ required: true, message: 'กรุณาระบุรายละเอียด' }]}
              initialValue={_.get(reportItems, 'investigation.conducting', '')}
            >
              <WYSIWYGV2 readOnly={reportExported} />
            </Form.Item>
          </Card>

          <Card>
            <Form.Item
              name="investigator_opinion"
              label={<Text strong>๓.ความเห็นของผู้สืบสวน</Text>}
              className="gx-mb-0"
              rules={[{ required: true, message: 'กรุณาระบุรายละเอียด' }]}
              initialValue={_.get(reportItems, 'investigation.investigator_opinion', '')}
            >
              <WYSIWYGV2 readOnly={reportExported} />
            </Form.Item>
          </Card>

          <Card>
            <Form.Item
              name="key_consideration"
              label={<Text strong>๔. ข้อพิจาณา</Text>}
              className="gx-mb-0"
              rules={[{ required: true, message: 'กรุณาระบุรายละเอียด' }]}
              initialValue={_.get(reportItems, 'investigation.key_consideration', '')}
            >
              <WYSIWYGV2 readOnly={reportExported} />
            </Form.Item>
          </Card>

          <Card>
            <Text strong>เจ้าหน้าที่สืบสวน</Text>

            <div className="gx-mt-4">
              <InsideArrestTeam form={form} fieldName="investigator" />
            </div>
          </Card>

          <Guarded {...guardedProps}>
            <Space className="gx-full-width gx-flex-end">
              <Button type="primary" loading={formLoading} onClick={() => form.submit()} disabled={!eventChange}>
                บันทึก
              </Button>
            </Space>
          </Guarded>
        </Form>
      </Card>
    </>
  );
};

export default Investigation;
