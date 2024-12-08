import { useEffect, useState } from 'react';
import { Button, Card, Checkbox, Form, Space, Spin, Typography } from 'antd';
import ReportStore from 'mobx/ReportStore';
import _ from 'lodash';
import FullPersonAppendForm from 'views/app-views/MasterIndices/Components/FullPersonAppendForm';
import MultipleFileUpload from 'components/shared-components/MultipleFileUpload';
import OrganizationAppendForm from 'views/app-views/MasterIndices/Components/OrganizationAppendForm';
import MapAppendForm from 'views/app-views/MasterIndices/Components/MapAppendForm';
import VehicleAppendForm from 'views/app-views/MasterIndices/Components/VehicleAppendForm';
import PropertyAppendForm from 'views/app-views/MasterIndices/Components/PropertyAppendForm';
import Guarded from 'components/shared-components/Guarded';

const { Text } = Typography;

const Incidence = ({ iRef, guardedProps = null }) => {
  const [form] = Form.useForm();
  const { reportItems } = ReportStore;
  const reportId = _.get(reportItems, '_id', '-');
  const reportExported = _.get(reportItems, 'is_exported', false);

  const [formLoading, setFormLoading] = useState(false);
  const [assignAuthorization, setAssignAuthorization] = useState(false);
  const [hasTranslator, setHasTranslator] = useState(false);

  const [eventChange, setEventChange] = useState(false);

  useEffect(() => {
    const forceData = _.get(reportItems, 'event', {});

    setAssignAuthorization(_.get(reportItems, 'event.is_attorney', false));
    setHasTranslator(_.get(reportItems, 'event.is_interpreter', false));

    form.setFieldsValue({ ...forceData });
  }, []);

  const finishForm = (values) => {
    setFormLoading(true);
    const payload = {
      ...values,
      is_attorney: _.get(values, 'is_attorney', false),
      is_interpreter: _.get(values, 'is_interpreter', false),
    };

    ReportStore.updateReport(
      {
        event: payload,
      },
      reportId
    )
      .then(() => setEventChange(false))
      .finally(() => setFormLoading(false));
  };

  return (
    <>
      <Card ref={(el) => (iRef.current['2'] = el)}>
        <Spin spinning={formLoading}>
          <Text strong>เหตุการณ์</Text>

          <Form form={form} layout="vertical" onFinish={finishForm} disabled={reportExported}>
            <Card className="gx-mt-4">
              <Space direction="horizontal">
                <Text strong>ผู้แจ้ง</Text>

                <Form.Item name="is_interpreter" label="" valuePropName="checked" className="gx-mb-0 gx-ml-3">
                  <Checkbox onChange={(el) => setHasTranslator(el.target.checked)}>มีล่าม</Checkbox>
                </Form.Item>

                <Form.Item name="is_attorney" label="" valuePropName="checked" className="gx-mb-0">
                  <Checkbox onChange={(el) => setAssignAuthorization(el.target.checked)}>มีการมอบอำนาจ</Checkbox>
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
                  disabled={reportExported}
                />
              </div>
            </Card>

            {hasTranslator && (
              <Card>
                <Text strong>ผู้ทำหน้าที่ล่าม</Text>

                <div className="gx-mt-4">
                  <FullPersonAppendForm
                    isRelationship={false}
                    setEventChange={setEventChange}
                    form={form}
                    fieldName="interpreter"
                    singleValue={true}
                    addButtonText="เพิ่มผู้ทำหน้าที่ล่าม"
                    disabled={reportExported}
                  />
                </div>
              </Card>
            )}

            {assignAuthorization && (
              <Card>
                <Text strong>ผู้มอบอำนาจ</Text>

                <div className="gx-mt-4">
                  <FullPersonAppendForm
                    isRelationship={false}
                    setEventChange={setEventChange}
                    form={form}
                    fieldName="attorney"
                    singleValue={true}
                    addButtonText="เพิ่มผู้มอบอำนาจ"
                    disabled={reportExported}
                  />

                  <Card className="gx-mt-4">
                    <Text strong>เอกสารเกี่ยวกับการมอบอำนาจ</Text>

                    <Form.Item name="attorney_document" label="" className="gx-mb-0 gx-mt-4">
                      <MultipleFileUpload form={form} bucketName="report" fieldName="attorney_document" />
                    </Form.Item>
                  </Card>
                </div>
              </Card>
            )}

            <Card>
              <Text strong>บุคคล หรือนิติบุคคล ที่เกี่ยวข้อง</Text>

              <div className="gx-mt-4">
                <FullPersonAppendForm
                  isRelationship={false}
                  setEventChange={setEventChange}
                  form={form}
                  fieldName="related_third_party"
                  addButtonText="บุคคล หรือนิติบุคคล ที่เกี่ยวข้อง"
                  disabled={reportExported}
                />
              </div>
            </Card>

            <Card>
              <Text strong>องค์กร/หน่วยงานที่เกี่ยวข้อง</Text>

              <div className="gx-mt-4">
                <OrganizationAppendForm
                  setEventChange={setEventChange}
                  isRelationship={false}
                  form={form}
                  fieldName="related_organization"
                  disabled={reportExported}
                />
              </div>
            </Card>

            <Card>
              <Text strong>สถานที่เกิดเหตุ</Text>

              <div className="gx-mt-4">
                <MapAppendForm
                  setEventChange={setEventChange}
                  muliple={true}
                  form={form}
                  fieldName="venue"
                  disabled={reportExported}
                />
              </div>
            </Card>

            <Card>
              <Text strong>ทรัพย์สิน</Text>
              <div className="gx-mt-4">
                <PropertyAppendForm
                  setEventChange={setEventChange}
                  form={form}
                  fieldName="property"
                  plaintMode={true}
                  disabled={reportExported}
                />
              </div>
            </Card>

            {reportItems.report_type_id === '62de3f0a23f9581f69023856' && (
              <Card>
                <Text strong>ยานพาหนะ</Text>

                <div className="gx-mt-4">
                  <VehicleAppendForm
                    setEventChange={setEventChange}
                    form={form}
                    fieldName="vehicle"
                    disabled={reportExported}
                  />
                </div>
              </Card>
            )}

            <Guarded {...guardedProps}>
              <Space className="gx-full-width gx-flex-end">
                <Button
                  data-testid="incident-button-submit"
                  type="primary"
                  loading={formLoading}
                  onClick={() => form.submit()}
                  disabled={!eventChange}
                >
                  บันทึก
                </Button>
              </Space>
            </Guarded>
          </Form>
        </Spin>
      </Card>
    </>
  );
};

export default Incidence;
