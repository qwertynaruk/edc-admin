import { useEffect, useState } from 'react';
import { Button, Card, Checkbox, Col, Form, Input, Row, Select, Space, Spin, Typography } from 'antd';
import DatePicker from 'components/shared-components/DatePicker';
import ReportStore from 'mobx/ReportStore';
import DatePickerISOHoC from 'components/shared-components/DatePickerISOHoC';
import PersonnelSelectWidget from 'components/shared-components/PersonnelSelectWidget';
import MapAppendForm from 'views/app-views/MasterIndices/Components/MapAppendForm';
import WYSIWYGV2 from 'components/shared-components/WYSIWYGV2';
import _ from 'lodash';
import FullPersonAppendForm from 'views/app-views/MasterIndices/Components/FullPersonAppendForm';
import PropertyAppendForm from 'views/app-views/MasterIndices/Components/PropertyAppendForm';
import VehicleAppendForm from 'views/app-views/MasterIndices/Components/VehicleAppendForm';
import MasterSelectWidget from 'components/shared-components/MasterSelectWidget';
import OffenseCodePlainTypeSelectWidget from 'components/shared-components/OffenseCodePlainTypeSelectWidget';
import IncidenceAnnounceStatusSelectWidget from 'components/shared-components/IncidenceAnnounceStatusSelectWidget';
import Guarded from 'components/shared-components/Guarded';

const { Text } = Typography;
const { Option } = Select;

const IncidenceAnnounce = ({ iRef, guardedProps = null }) => {
  const [form] = Form.useForm();

  const { reportItems } = ReportStore;
  const reportId = _.get(reportItems, '_id', '-');
  const reportExported = _.get(reportItems, 'is_exported', false);
  const isDisabledForm = _.get(reportItems, 'notification.status') !== 'รอดำเนินการ';
  const [eventChange, setEventChange] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const forceData = _.get(reportItems, 'notification', {});

    form.setFieldsValue(forceData);
    form.setFieldsValue({ created_at: _.get(reportItems, 'created_at', '') });
  }, []);

  const finishForm = (values) => {
    setFormLoading(true);

    const newValues = values;
    delete newValues.created_at;

    ReportStore.updateReport(
      {
        notification: newValues,
      },
      reportId
    )
      .then(() => setEventChange(false))
      .finally(() => setFormLoading(false));
  };
  return (
    <Card ref={(el) => (iRef.current['การแจ้งเหตุ'] = el)}>
      <Spin spinning={formLoading}>
        <Text strong>การแจ้งเหตุ</Text>

        <Form
          layout="vertical"
          form={form}
          onFinish={finishForm}
          onValuesChange={() => setEventChange(true)}
          disabled={isDisabledForm}
        >
          <Card className="gx-mt-4">
            <Row className="gx-flex-row" gutter={[16, 16]}>
              <Col span={16}>
                <Form.Item
                  name="event_name"
                  label="ชื่อเหตุการณ์"
                  rules={[{ required: true, message: 'กรุณากรอกชื่อเหตุการณ์' }]}
                >
                  <Input placeholder="กรอกชื่อเหตุการณ์" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="source"
                  label="แหล่งที่มา"
                  rules={[{ required: true, message: 'กรุณาเลือกแหล่งที่มา' }]}
                >
                  <Select placeholder="เลือกแหล่งที่มา">
                    <Option value="ได้รับแจ้ง">ได้รับแจ้ง</Option>
                    <Option value="เหตุซึ่งหน้า">เหตุซึ่งหน้า</Option>
                  </Select>
                </Form.Item>
              </Col>

              <OffenseCodePlainTypeSelectWidget form={form} disabled={isDisabledForm} />

              <Col span={8}>
                <Form.Item name="status" label="สถานะ">
                  <IncidenceAnnounceStatusSelectWidget />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="created_at" label="วันเวลาที่รับแจ้ง">
                  <DatePickerISOHoC>
                    <DatePicker
                      showTime={{ format: 'HH:mm' }}
                      disabled
                      className="gx-full-width"
                      placeholder="เลือกวันเวลา"
                    />
                  </DatePickerISOHoC>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="start_date"
                  label="วันเวลาที่เกิดเหตุ"
                  rules={[{ required: true, message: 'กรุณาเลือกวันเวลาที่เกิดเหตุ' }]}
                >
                  <DatePickerISOHoC>
                    <DatePicker
                      showTime={{ format: 'HH:mm' }}
                      className="gx-full-width"
                      placeholder="เลือกวันเวลาที่เกิดเหตุ"
                      disabled={isDisabledForm}
                    />
                  </DatePickerISOHoC>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="end_date" label="วันเวลาที่สิ้นสุด">
                  <DatePickerISOHoC>
                    <DatePicker
                      showTime={{ format: 'HH:mm' }}
                      className="gx-full-width"
                      placeholder="เลือกวันเวลาที่สิ้นสุด"
                      disabled={isDisabledForm}
                    />
                  </DatePickerISOHoC>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card>
            <Text strong>เจ้าหน้าที่และผลการปฏิบัติ</Text>

            <div className="gx-mt-4">
              <Row className="gx-flex-row" gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item name={['officer_and_result', 'investigator']} label="เวรสืบสวน">
                    <PersonnelSelectWidget placeholder="เลือกเวรสืบสวน" category="สืบสวน" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item name={['officer_and_result', 'inquisitor']} label="เวรสอบสวน">
                    <PersonnelSelectWidget placeholder="เลือกเวรสอบสวน" category="สอบสวน" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item name={['officer_and_result', 'suppression']} label="เวรป้องกันปราบปราม">
                    <PersonnelSelectWidget placeholder="เลือกเวรป้องกันปราบปราม" category="ป้องกันปราบปราม" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                      const _target = getFieldValue('status');
                      return (
                        <Form.Item
                          label="ผลการปฎิบัติ"
                          className="gx-mb-0"
                          name={['officer_and_result', 'result']}
                          rules={[{ required: _target === 'เสร็จสิ้น', message: 'กรุณาเลือกผลการปฎิบัติ' }]}
                        >
                          <MasterSelectWidget placeholder="เลือกผลการปฎิบัติ" category="73" />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Card>

          <Card>
            <Text strong>สถานที่เกิดเหตุ</Text>

            <div className="gx-mt-4">
              <MapAppendForm form={form} fieldName="venue" disabled={isDisabledForm} />
            </div>
          </Card>

          <Card>
            <Text strong>รายละเอียดเหตุการณ์</Text>

            <div className="gx-mt-4">
              <Form.Item name="content" initialValue={_.get(reportItems, 'notification.content', '')}>
                <WYSIWYGV2 readOnly={isDisabledForm} />
              </Form.Item>
            </div>
          </Card>

          <Card>
            <Space direction="horizontal">
              <Text strong>ผู้แจ้งเหตุ</Text>

              <Form.Item shouldUpdate noStyle>
                {({ getFieldValue }) => {
                  return (
                    <Form.Item
                      name={['informer', 'is_victim']}
                      label=""
                      valuePropName="checked"
                      className="gx-mb-0 gx-ml-3"
                    >
                      <Checkbox disabled={!getFieldValue('informer')}>เป็นผู้เสียหาย</Checkbox>
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Space>

            <div className="gx-mt-4">
              <FullPersonAppendForm
                isRelationship={false}
                setEventChange={setEventChange}
                form={form}
                fieldName="informer"
                singleValue={true}
                addButtonText="เพิ่มผู้แจ้ง"
                disabled={isDisabledForm}
              />
            </div>
          </Card>

          <Card>
            <Text strong>ผู้เสียหาย</Text>

            <div className="gx-mt-4">
              <FullPersonAppendForm
                isRelationship={false}
                setEventChange={setEventChange}
                form={form}
                fieldName="victim"
                addButtonText="เพิ่มผู้เสียหาย"
                disabled={reportExported}
              />
            </div>
          </Card>

          <Card>
            <Text strong>ผู้ต้องสงสัย</Text>

            <div className="gx-mt-4">
              <FullPersonAppendForm
                isRelationship={false}
                setEventChange={setEventChange}
                form={form}
                fieldName="suspect"
                addButtonText="เพิ่มผู้ต้องสงสัย"
                disabled={reportExported}
              />
            </div>
          </Card>

          <Card>
            <Text strong>ยานพาหนะที่ใช้ทำความผิด</Text>

            <div className="gx-mt-4">
              <VehicleAppendForm form={form} fieldName="vehicle_for_crime" />
            </div>
          </Card>

          <Card>
            <Text strong>ทรัพย์สิน ที่ถูกประทุษร้าย</Text>
            <div className="gx-mt-4">
              <PropertyAppendForm form={form} plaintMode={true} fieldName="property" />
            </div>
          </Card>

          <Card>
            <Text strong>ยานพาหนะ ที่ถูกประทุษร้าย</Text>
            <div className="gx-mt-4">
              <VehicleAppendForm form={form} plaintMode={true} fieldName="vehicle" />
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
      </Spin>
    </Card>
  );
};

export default IncidenceAnnounce;
