import { useEffect, useState } from 'react';
import { Button, Card, Checkbox, Col, Form, Input, Row, Select, Space, Spin, Typography } from 'antd';
import OrganizationAppendForm from 'views/app-views/MasterIndices/Components/OrganizationAppendForm';
import VehicleAppendForm from 'views/app-views/MasterIndices/Components/VehicleAppendForm';
import PropertyAppendForm from 'views/app-views/MasterIndices/Components/PropertyAppendForm';
import FullPersonAppendForm from 'views/app-views/MasterIndices/Components/FullPersonAppendForm';
import MultipleFileUpload from 'components/shared-components/MultipleFileUpload';
import ReportStore from 'mobx/ReportStore';
import _ from 'lodash';
import CaseNumberModal from './CaseNumberModal';
import EvidenceAssign from './EvidenceAssign';
import OffenseComplexForm from './OffenseComplexForm';
import { observer } from 'mobx-react';
import MapAppendForm from 'views/app-views/MasterIndices/Components/MapAppendForm';
import A2O from 'utils/A2O';
import CaseStatusSelectWidget from 'components/shared-components/CaseStatusSelectWidget';
import ProceedingsTypeSelectWidget from 'components/shared-components/ProceedingsTypeSelectWidget';
import Guarded from 'components/shared-components/Guarded';

const { Text } = Typography;

const caseTypeOptions = [
  {
    value: 'คดีอาญา',
    label: 'คดีอาญา',
  },
  {
    value: 'คดีจราจร',
    label: 'คดีจราจร',
  },
];

const Erroneousness = ({ iRef, guardedProps = null }) => {
  const [form] = Form.useForm();

  const { typesList, reportItems } = ReportStore;
  const reportId = _.get(reportItems, '_id', '-');
  const reportExported = _.get(reportItems, 'is_exported', false);

  const [eventChange, setEventChange] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [visibleCaseNumberModal, setVisibleCaseNumberModal] = useState(false);
  const [assignAuthorization, setAssignAuthorization] = useState(false);
  const [hasTranslator, setHasTranslator] = useState(false);
  const [offenseFieldList, setOffenseFieldList] = useState([]);

  useEffect(() => {
    const forceData = _.get(reportItems, 'offense', {});

    setAssignAuthorization(_.get(reportItems, 'offense.is_attorney', false));
    setHasTranslator(_.get(reportItems, 'offense.is_interpreter', false));
    setOffenseFieldList(_.get(reportItems, 'offense.offense_detail', []));

    form.setFieldsValue({
      ...forceData,
      case: A2O.CHECK_ANY_OBJECT(forceData?.case)
        ? {
            ...forceData?.case,
            case_id: _.get(forceData, 'case.case_id')
              ? [forceData.case.case_id, forceData.case.case_year].join('/')
              : '',
          }
        : {},
    });
  }, []);

  useEffect(() => {
    const offenseCaseType = _.get(reportItems, 'offense.case.case_type');
    if (offenseCaseType) {
      form.setFieldsValue({ case: { case_type: offenseCaseType } });
      return;
    }
    const type = _.find(typesList, (e) => e._id === _.get(reportItems, 'report_type_id', '-'));
    if (!type) return;
    const caseType = _.find(caseTypeOptions, (e) => type.name.includes(e.value));
    if (!caseType) return;
    form.setFieldsValue({
      case: {
        case_type: caseType.value,
      },
    });
  }, [form, reportItems, typesList]);

  const onOffenseFieldListChange = (el) => {
    setOffenseFieldList(el);
    setEventChange(true);
  };

  const onSelectCaseNumber = (el) => {
    const { number = '', year = '' } = el;
    form.setFieldsValue({ case: { case_id: [number, year].join('/'), case_year: year } });
  };

  const finishForm = (values) => {
    setFormLoading(true);
    const offenseDetail = _.get(values, 'offense_detail', []);
    const newOffense =
      offenseDetail.length > 0
        ? offenseDetail.map((ss, _index) => ({
            ...offenseFieldList[_index],
            ...ss,
            period_date: _.get(ss, 'period_date', []),
            is_date: _.get(ss, 'period_date', false),
          }))
        : [];

    const newValues = {
      ...reportItems.offense,
      ...values,
      offense_detail: newOffense,
      is_attorney: _.get(values, 'is_attorney', false),
      is_interpreter: _.get(values, 'is_interpreter', false),
      case: A2O.CHECK_ANY_OBJECT(values?.case)
        ? {
            ...values?.case,
            case_id: _.get(values, 'case.case_id') ? values.case.case_id.split('/')[0] : '',
          }
        : {},
    };

    ReportStore.updateReport(
      {
        offense: newValues,
      },
      reportId
    )
      .then(() => setEventChange(false))
      .finally(() => setFormLoading(false));
  };

  return (
    <>
      <Card ref={(el) => (iRef.current['ความผิด'] = el)}>
        <Spin spinning={formLoading}>
          <Text strong>ความผิด</Text>

          <Form
            form={form}
            layout="vertical"
            onFinish={finishForm}
            onValuesChange={() => setEventChange(true)}
            disabled={reportExported}
          >
            <Card className="gx-mt-4">
              <Text strong>รายละเอียดคดี</Text>

              <div className="gx-mt-4">
                <Row className="gx-flex-row" gutter={[16, 16]}>
                  <Col span={8}>
                    <Form.Item name={['case', 'case_type']} label="ประเภทของคดี">
                      <Select placeholder="เลือกประเภทของคดี" options={caseTypeOptions} />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item name={['case', 'status']} label="สถานะทางคดี">
                      <CaseStatusSelectWidget />
                    </Form.Item>
                  </Col>

                  {_.get(reportItems, 'offense.evidence_case_number', '') &&
                  _.get(reportItems, 'offense.evidence_case_year', '') ? (
                    <Col span={8}>
                      <Form.Item
                        name={['case', 'case_id']}
                        label="หมายเลขคดี"
                        initialValue={[
                          _.get(reportItems, 'offense.evidence_case_number', ''),
                          _.get(reportItems, 'offense.evidence_case_year', ''),
                        ].join('/')}
                      >
                        <Input readOnly />
                      </Form.Item>
                    </Col>
                  ) : (
                    <>
                      <Col span={_.get(reportItems, 'offense.case.case_id', '') ? 8 : 4}>
                        <Form.Item name={['case', 'case_id']} label="หมายเลขคดี">
                          <Input readOnly />
                        </Form.Item>

                        <Form.Item name={['case', 'case_year']} hidden noStyle>
                          <Input />
                        </Form.Item>
                      </Col>

                      {!_.get(reportItems, 'offense.case.case_id', '') && (
                        <Col span={4}>
                          <Button className="gx-mt-4" type="primary" onClick={() => setVisibleCaseNumberModal(true)}>
                            เพิ่มหมายเลขคดี
                          </Button>
                        </Col>
                      )}
                    </>
                  )}

                  <Col span={8}>
                    <Form.Item name={['case', 'proceedings_type']} label="ประเภทการดำเนินคดี">
                      <ProceedingsTypeSelectWidget />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Card>

            <Card className="gx-mt-4">
              <Text strong>รายละเอียดความผิด</Text>

              <div className="gx-mt-4">
                <OffenseComplexForm
                  form={form}
                  offenseFieldList={offenseFieldList}
                  setOffenseFieldList={onOffenseFieldListChange}
                />
              </div>
            </Card>

            <Card>
              <Text strong>สถานที่เกิดเหตุ</Text>

              <div className="gx-mt-4">
                <MapAppendForm setEventChange={setEventChange} form={form} fieldName="venue" muliple={true} />
              </div>
            </Card>

            <Card>
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
                  fieldName="informer"
                  addButtonText="เพิ่มผู้แจ้ง"
                  form={form}
                  singleValue={true}
                  isRelationship={false}
                  setEventChange={setEventChange}
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
              <Text strong>พยาน</Text>

              <div className="gx-mt-4">
                <FullPersonAppendForm
                  isRelationship={false}
                  setEventChange={setEventChange}
                  form={form}
                  fieldName="witness"
                  addButtonText="เพิ่มพยาน"
                  disabled={reportExported}
                />
              </div>
            </Card>

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
                />
              </div>
            </Card>

            <Card>
              <Text strong>ทรัพย์สิน</Text>
              <div className="gx-mt-4">
                <PropertyAppendForm
                  setEventChange={setEventChange}
                  form={form}
                  plaintMode={true}
                  fieldName="property"
                />
              </div>
            </Card>

            <Card>
              <Text strong>ยานพาหนะ</Text>

              <div className="gx-mt-4">
                <VehicleAppendForm setEventChange={setEventChange} form={form} fieldName="vehicle" />
              </div>
            </Card>

            <Guarded {...guardedProps}>
              <Space className="gx-full-width gx-flex-end">
                <Button
                  data-testid="erroneousness-button-submit"
                  type="primary"
                  loading={formLoading}
                  onClick={() => form.submit()}
                  disabled={!eventChange}
                >
                  บันทึก
                </Button>
              </Space>
            </Guarded>

            <Form.Item shouldUpdate noStyle>
              {({ getFieldValue }) => {
                const caseType = getFieldValue(['case', 'case_type']);
                return (
                  <CaseNumberModal
                    visible={visibleCaseNumberModal}
                    caseType={caseType}
                    setVisible={(ss) => setVisibleCaseNumberModal(ss)}
                    onValuesChange={() => setEventChange(true)}
                    onSelected={onSelectCaseNumber}
                  />
                );
              }}
            </Form.Item>
          </Form>
        </Spin>
      </Card>

      <Card>
        <Text strong>บัญชีของกลาง</Text>

        <div className="gx-mt-4">
          <EvidenceAssign form={form} guardedProps={guardedProps} />
        </div>
      </Card>
    </>
  );
};

export default observer(Erroneousness);
