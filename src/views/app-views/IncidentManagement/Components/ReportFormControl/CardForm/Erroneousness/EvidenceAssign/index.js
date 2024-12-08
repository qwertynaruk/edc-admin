import { useEffect, useState } from 'react';
import _ from 'lodash';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { Button, Col, Form, Input, Modal, Row, Select, Space, Spin, Typography } from 'antd';
import ReportStore from 'mobx/ReportStore';
import FormPreference from 'utils/FormPreference';
import PropertiesEvidenceForm from '../PropertiesEvidenceForm';
import DialogNotification from 'components/shared-components/DialogNotification';
import { GuardHandles } from 'components/shared-components/Guarded';

const NewSwal = withReactContent(Swal);

const EvidenceAssign = (props) => {
  const [form] = Form.useForm();
  const canUpdate = GuardHandles(props?.guardedProps);
  const { reportItems, propertieStorageList } = ReportStore;
  const reportId = _.get(reportItems, '_id', '-');

  const [loading, setLoading] = useState(false);
  const [tblLoading, setTblLoading] = useState(false);
  const [addIntoCurrentCaseEnable, setAddIntoCurrentCaseEnable] = useState(false);
  const [visibleNumberVerifyModal, setVisibleNumberVerifyModal] = useState(false);
  const [visiblePropertiesModal, setVisiblePropertiesModal] = useState(false);
  const [rawDataSource, setRawDataSource] = useState([]);
  const [personSource, setPersonSource] = useState([]);
  const [beforeFormValue, setBeforeFormValue] = useState(null);

  useEffect(() => {
    const { offense = {} } = reportItems;
    const vehicleList = _.get(offense, 'vehicle', []);
    const propertyList = _.get(offense, 'property', []);
    const allProperties = propertyList.concat(vehicleList);

    const attorney = _.get(offense, 'attorney', []);

    const newPersonSource = attorney.concat(
      _.get(offense, 'informer', []),
      _.get(offense, 'interpreter', []),
      _.get(offense, 'related_third_party', []),
      _.get(offense, 'victim', []),
      _.get(offense, 'suspect', []),
      _.get(offense, 'witness', [])
    );

    setRawDataSource(allProperties);
    setPersonSource(newPersonSource);

    ReportStore.getPropertieStorageList();
  }, [reportItems]);

  const onCheckBeforeAppend = () => {
    const { offense = {} } = reportItems;
    const isCaseId = _.get(offense, 'case.case_id', '');
    const inCustody = rawDataSource.filter((ss) => ss?.police_custody === 'ใช่');

    if (!isCaseId || rawDataSource.length <= 0 || personSource.length <= 0 || inCustody.length <= 0) {
      const plainText =
        personSource.length <= 0
          ? 'กรุณาเพิ่มรายการบุคคลก่อนทำรายการ'
          : rawDataSource.length <= 0
          ? 'กรุณาเพิ่มทรัพย์สินก่อนทำรายการ'
          : inCustody.length <= 0
          ? 'กรุณาระบุการดูแลของตำรวจ<br />ในรายการทรัพย์สินและยานพาหนะที่ต้องการทำรายการ'
          : !isCaseId
          ? 'กรุณาเพิ่มหมายเลขคดีก่อนทำรายการ'
          : '';

      NewSwal.fire({
        title: 'แจ้งเตือน',
        html: plainText,
        confirmButtonText: 'รับทราบ',
        confirmButtonColor: '#1B2531',
        footer:
          rawDataSource.length > 0 && personSource.length > 0 && inCustody.length > 0 && !isCaseId ? (
            <Button type="link" onClick={onAddIntoCurrentCaseChange}>
              เพิ่มของกลางในคดีเดิม
            </Button>
          ) : null,
      });
    } else {
      setVisibleNumberVerifyModal(true);
    }
  };

  const onAddIntoCurrentCaseChange = () => {
    setAddIntoCurrentCaseEnable(true);
    setVisibleNumberVerifyModal(true);
    NewSwal.close();
  };

  const handleNumberVerify = {
    unmountForm: () => {
      setVisibleNumberVerifyModal(false);
      setAddIntoCurrentCaseEnable(false);
    },
    submitForm: (values) => {
      // console.log(props.form.getFieldValue('case_type'), values);
      setLoading(true);
      const {
        evidence_central_account_number = '',
        evidence_central_account_year = '',
        evidence_case_number = '',
        evidence_case_year = '',
      } = values;

      setBeforeFormValue(values);

      ReportStore.verifyEvidenceNumber({
        evidence_central_account_number,
        evidence_central_account_year,
      })
        .then(() => {
          if (evidence_case_number && evidence_case_year) {
            ReportStore.verifyCaseNumber({
              case_id: `${evidence_case_number}/${evidence_case_year}`,
              case_year: evidence_case_year,
              case_type: props.form.getFieldValue(['case', 'case_type']),
            })
              .then((resp) => {
                if (!resp) {
                  throw new Error();
                }
                setVisiblePropertiesModal(true);
              })
              .catch(() => {
                DialogNotification('error', 'ไม่สามารถใช้เลขนี้ได้', 'เนื่องจากเลขคดีไม่มีในระบบ');
              });
          } else {
            setVisiblePropertiesModal(true);
          }
        })
        .catch(() => DialogNotification('error', 'ไม่สามารถใช้เลขนี้ได้', 'เนื่องจากเลขบัญชีของกลางซ้ำกับในระบบ'))
        .finally(() => setLoading(false));
    },
  };

  const handleEvidenceTransfer = {
    unmountForm: () => {
      setVisiblePropertiesModal(false);
    },
    submitForm: (values) => {
      setTblLoading(true);
      const { offense = {} } = reportItems;
      const rawPayload = {
        ...offense,
        ...beforeFormValue,
        ...values,
      };
      const payload = {
        offense: rawPayload,
      };

      const mapEvidenceStorage = (_element = []) =>
        propertieStorageList.length <= 0
          ? _element.map((_ps) => ({ id: _ps }))
          : _element.map((_ps) => ({
              ...(propertieStorageList.filter((qx) => qx._id === _ps).length > 0
                ? {
                    id: _ps,
                    ...(propertieStorageList.find((qx) => qx._id === _ps).parent_id
                      ? { parent_id: propertieStorageList.find((qx) => qx._id === _ps).parent_id }
                      : {}),
                    storage_name: propertieStorageList.find((qx) => qx._id === _ps).storage_name,
                  }
                : {
                    id: _ps,
                  }),
            }));

      const evidencePayload = {
        report_id: reportId,
        evidence_central_account_number: _.get(rawPayload, 'evidence_central_account_number', ''),
        evidence_central_account_year: _.get(rawPayload, 'evidence_central_account_year', ''),
        evidence_case_number: _.get(rawPayload, 'case.case_id', _.get(rawPayload, 'evidence_case_number', '')),
        evidence_case_year: _.get(rawPayload, 'case.case_year', _.get(rawPayload, 'evidence_case_year', '')),
        evidence_properties: rawPayload?.evidence_account.map((ss) => ({
          ...ss,
          property_storage: mapEvidenceStorage(ss.property_storage),
          property_status: 'ครอบครอง',
        })),
      };

      doApiProcess(payload, evidencePayload);
    },
  };

  const doApiProcess = (payload, evidencePayload) => {
    ReportStore.createEvidenceUpsert(evidencePayload)
      .then(() =>
        ReportStore.updateReport(payload, reportId).then(() => {
          setVisibleNumberVerifyModal(false);
          setVisiblePropertiesModal(false);
        })
      )
      .finally(() => {
        setTblLoading(false);
      });
  };

  return (
    <>
      <Space direction="vertical">
        <Typography.Text>หมายเลขบัญชีของกลาง</Typography.Text>

        <Space>
          <Input value={_.get(reportItems, 'offense.evidence_central_account_number', '')} readOnly />
          {!_.get(reportItems, 'offense.evidence_central_account_number', '') && (
            <Button type="primary" onClick={onCheckBeforeAppend} disabled={!canUpdate}>
              เพิ่มบัญชีของกลาง
            </Button>
          )}
        </Space>
      </Space>

      <Modal
        visible={visibleNumberVerifyModal}
        title="หมายเลขบัญชีของกลาง"
        width={480}
        centered
        style={{ marginTop: 15 }}
        onCancel={() => setVisibleNumberVerifyModal(false)}
        footer={[
          <Button key="cancel" onClick={handleNumberVerify.unmountForm}>
            ยกเลิก
          </Button>,
          <Button key="save" loading={loading} type="primary" onClick={() => form.submit()}>
            บันทึก
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <Form form={form} layout="vertical" onFinish={handleNumberVerify.submitForm}>
            <Row className="gx-flex-row" gutter={[12, 12]}>
              <Col span={12}>
                <Form.Item
                  name="evidence_central_account_number"
                  label="เลขบัญชีของกลาง"
                  rules={[{ required: true, message: 'กรุณากรอกเลขบัญชีของกลาง' }]}
                  className="gx-mb-0"
                >
                  <Input placeholder="กรอกเลขบัญชีของกลาง" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="evidence_central_account_year"
                  label="ปีบัญชีของกลาง"
                  rules={[{ required: true, message: 'กรุณาเลือกปีบัญชีของกลาง' }]}
                  className="gx-mb-0"
                >
                  <Select placeholder="เลือกปีบัญชีของกลาง">{FormPreference.RenderYearList()}</Select>
                </Form.Item>
              </Col>

              {addIntoCurrentCaseEnable && (
                <Col span={12}>
                  <Form.Item
                    name="evidence_case_number"
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
              )}

              {addIntoCurrentCaseEnable && (
                <Col span={12}>
                  <Form.Item
                    name="evidence_case_year"
                    label="ปีคดี"
                    rules={[{ required: true, message: 'กรุณาเลือกปีคดี' }]}
                  >
                    <Select placeholder="เลือกปีคดี">{FormPreference.RenderYearList()}</Select>
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Form>
        </Spin>
      </Modal>

      <Modal
        visible={visiblePropertiesModal}
        title="รายการทรัพย์สิน"
        width={1200}
        centered
        closable={false}
        style={{ marginTop: 15 }}
        footer={null}
      >
        <PropertiesEvidenceForm
          loading={tblLoading}
          onFinish={handleEvidenceTransfer.submitForm}
          onBackEvent={handleEvidenceTransfer.unmountForm}
          forceRawDataSource={rawDataSource.filter((ss) => ss?.police_custody === 'ใช่')}
          forcePersonSource={personSource}
        />
      </Modal>
    </>
  );
};

export default EvidenceAssign;
