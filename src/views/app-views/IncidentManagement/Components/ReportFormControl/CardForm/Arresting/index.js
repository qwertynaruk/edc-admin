import { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Input, Row, Select, Space, Typography } from 'antd';
import DatePicker from 'components/shared-components/DatePicker';
import MapAppendForm from 'views/app-views/MasterIndices/Components/MapAppendForm';
import DatePickerISOHoC from 'components/shared-components/DatePickerISOHoC';
import FormPreference from 'utils/FormPreference';
import WYSIWYGV2 from 'components/shared-components/WYSIWYGV2';
import ReportStore from 'mobx/ReportStore';
import _ from 'lodash';
import PropertyAppendForm from 'views/app-views/MasterIndices/Components/PropertyAppendForm';
import FullPersonAppendForm from 'views/app-views/MasterIndices/Components/FullPersonAppendForm';
import OutsideArrestTeam from './OutsideArrestTeam';
import InsideArrestTeam from './InsideArrestTeam';
import VehicleAppendForm from 'views/app-views/MasterIndices/Components/VehicleAppendForm';
import HandleJuvenileFormSection from './HandleJuvenileFormSection';
import Guarded from 'components/shared-components/Guarded';

const { Text } = Typography;
const { Option } = Select;

const Arresting = ({
  iRef,
  juvenile = false,
  formRequiredField,
  setFormRequiredField = () => {},
  setFormDataAcceptInConditionAll = () => {},
  guardedProps = null,
}) => {
  const [form] = Form.useForm();
  const { reportItems } = ReportStore;
  const reportId = _.get(reportItems, '_id', '-');
  const reportExported = _.get(reportItems, 'is_exported', false);

  const [arrestingType, setArrestingType] = useState('');
  const [eventChange, setEventChange] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const forceData = _.get(reportItems, 'arrest', {});
    setArrestingType(_.get(forceData, 'is_warrant', false));
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

    const newValues = {
      ...values,
      is_warrant: _.get(values, 'is_warrant', false),
    };

    if (Object.keys(values.related_report).length <= 0) {
      delete newValues.related_report;
    }

    ReportStore.updateReport(
      {
        arrest: newValues,
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
      <Card ref={(el) => (iRef.current['การจับกุม'] = el)}>
        <Text strong>การจับกุม</Text>
        <Form
          form={form}
          layout="vertical"
          onFinish={finishForm}
          onValuesChange={onHandleValuesChange}
          disabled={reportExported}
        >
          <Card className="gx-mt-4">
            <Text strong>รายงานที่เชื่อมโยง</Text>
            <Row className="gx-flex-row gx-mt-4" gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item name={['related_report', 'report_record_id']} label="ข้อรายงานประจำวัน">
                  <Input placeholder="กรอกข้อรายงานประจำวัน" />
                </Form.Item>
              </Col>

              <Col span={16}>
                <Form.Item name={['related_report', 'datetime']} label="เลือกวันเวลา">
                  <DatePickerISOHoC>
                    <DatePicker showTime={{ format: 'HH:mm' }} className="gx-full-width" placeholder="เลือกวันเวลา" />
                  </DatePickerISOHoC>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name={['related_report', 'case_record_id']} label="คดีอาญาที่">
                  <Input placeholder="กรอกคดีอาญาที่" />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item name={['related_report', 'case_year']} label="ปีคดีอาญา">
                  <Select placeholder="เลือกปี">{FormPreference.RenderYearList()}</Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name={['related_report', 'evidence_central_account_number']} label="บัญชีของกลางลำดับที่">
                  <Input placeholder="กรอกบัญชีของกลางลำดับที่" />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item name={['related_report', 'evidence_central_account_year']} label="ปีบัญชีของกลาง">
                  <Select placeholder="เลือกปี">{FormPreference.RenderYearList()}</Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card className="gx-mt-4">
            <Text strong>ประเภทการจับกุม</Text>
            <Row className="gx-mt-4 gx-flex-row" gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item
                  name="is_warrant"
                  label="ประเภทการจับกุม"
                  rules={[{ required: true, message: 'กรุณาเลือกประเภทการจับกุม' }]}
                >
                  <Select onChange={(e) => setArrestingType(e)} placeholder="เลือกประเภทการจับกุม">
                    <Option value={true}>มีหมายจับ</Option>
                    <Option value={false}>ไม่มีหมายจับ</Option>
                  </Select>
                </Form.Item>
              </Col>

              {arrestingType && (
                <Col span={8}>
                  <Form.Item name="warrant_id" label="โดยจับกุมตามหมายจับ">
                    <Input placeholder="กรอกโดยจับกุมตามหมายจับ" />
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Card>

          <Card>
            <Text strong>วันเวลาและสถานที่บันทึก</Text>
            <Row className="gx-mt-4" gutter={[16, 16]}>
              <Col span={16}>
                <Form.Item
                  name={['record_at', 'datetime']}
                  label="เลือกวันเวลา"
                  rules={[{ required: true, message: 'กรุณาเลือกวันเวลา' }]}
                >
                  <DatePickerISOHoC>
                    <DatePicker showTime={{ format: 'HH:mm' }} placeholder="เลือกวันเวลา" className="gx-full-width" />
                  </DatePickerISOHoC>
                </Form.Item>
              </Col>

              <Col span={16}>
                <Form.Item
                  name={['record_at', 'location']}
                  label="สถานที่บันทึกการจับกุม"
                  rules={[{ required: true, message: 'กรุณากรอกสถานที่บันทึกการจับกุม' }]}
                >
                  <Input placeholder="กรอกสถานที่บันทึกการจับกุม" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card>
            <Text strong>วันเวลาที่จับกุม</Text>
            <Row className="gx-mt-4" gutter={[16, 16]}>
              <Col span={16}>
                <Form.Item
                  name="arresting_date"
                  label="เลือกวันเวลาที่จับกุม"
                  rules={[{ required: true, message: 'กรุณาเลือกวันเวลาที่จับกุม' }]}
                >
                  <DatePickerISOHoC>
                    <DatePicker
                      showTime={{ format: 'HH:mm' }}
                      placeholder="เลือกวันเวลาที่จับกุม"
                      className="gx-full-width"
                    />
                  </DatePickerISOHoC>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card>
            <Text strong>สถานที่จับกุม</Text>

            <div className="gx-mt-4">
              <MapAppendForm
                form={form}
                fieldName="arresting_location"
                setEventChange={setEventChange}
                disabled={reportExported}
              />
            </div>
          </Card>

          <Card>
            <Text strong>อำนวยการโดย</Text>

            <div className="gx-mt-4">
              <InsideArrestTeam form={form} fieldName="directed_officer" disabled={reportExported} />
            </div>
          </Card>

          <Card>
            <Text strong>ชุดจับกุมภายในองค์กร </Text>

            <div className="gx-mt-4">
              <Form.Item name={['internal_arrest_unit', 'organization_name']} label="ชื่อหน่วยงาน">
                <Input placeholder="กรอกชื่อหน่วยงาน" />
              </Form.Item>
              <InsideArrestTeam form={form} fieldName="internal_arrest_unit" subFieldName="officer" />
            </div>
          </Card>

          <Card>
            <Text strong>ชุดจับกุมภายนอกองค์กร</Text>

            <div className="gx-mt-4">
              <OutsideArrestTeam />
            </div>
          </Card>

          <Card>
            <Text strong>ผู้ต้องหา</Text>

            <div className="gx-mt-4">
              <FullPersonAppendForm
                isRelationship={false}
                setEventChange={setEventChange}
                form={form}
                fieldName="offender"
                addButtonText="เพิ่มผู้ต้องหา"
                isParent={juvenile}
                disabled={reportExported}
              />
            </div>
          </Card>

          <Card>
            <Text strong>ทรัพย์สินของกลาง</Text>
            <div className="gx-mt-4">
              <PropertyAppendForm
                form={form}
                plaintMode={true}
                fieldName="evidence_property"
                disabled={reportExported}
              />
            </div>
          </Card>

          <Card>
            <Text strong>ยานพาหนะของกลาง</Text>
            <div className="gx-mt-4">
              <VehicleAppendForm form={form} plaintMode={true} fieldName="evidence_vehicle" disabled={reportExported} />
            </div>
          </Card>

          <Card>
            <Text strong>ตำแหน่งที่พบของกลาง</Text>
            <div className="gx-mt-4">
              <Form.Item name="evidence_location">
                <Input placeholder="กรอกข้อมูลตำแหน่งที่พบของกลาง" />
              </Form.Item>
            </div>
          </Card>

          <Card>
            <Form.Item
              name="accusation"
              label={<Text strong>โดยกล่าวหาว่า</Text>}
              className="gx-mb-0"
              rules={[{ required: true, message: 'กรุณาระบุรายละเอียด' }]}
              initialValue={_.get(reportItems, 'arrest.accusation', '')}
            >
              <WYSIWYGV2 readOnly={reportExported} />
            </Form.Item>
          </Card>

          <HandleJuvenileFormSection
            form={form}
            isJuvenile={juvenile}
            reportItems={reportItems}
            disabled={reportExported}
            setEventChange={setEventChange}
          />
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

export default Arresting;
