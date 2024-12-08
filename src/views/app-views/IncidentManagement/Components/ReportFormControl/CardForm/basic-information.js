import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { Button, Card, Checkbox, Col, Form, Row, Select, Space, Spin, Typography } from 'antd';
import DatePicker from 'components/shared-components/DatePicker';
import { SuffixCheckbox } from 'utils/style-js';
import ReportStore from 'mobx/ReportStore';
import DatePickerISOHoC from 'components/shared-components/DatePickerISOHoC';
import _ from 'lodash';
import PersonnelSelectWidget from 'components/shared-components/PersonnelSelectWidget';
import DataSourceSelectWidget from 'components/shared-components/DataSourceSelectWidget';
import Guarded from 'components/shared-components/Guarded';

const { Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const BasicInformation = ({
  iRef,
  formRequiredField,
  setFormRequiredField = () => {},
  setFormDataAcceptInConditionAll = () => {},
  guardedProps = null,
}) => {
  const [form] = Form.useForm();

  const { reportItems } = ReportStore;
  const reportId = _.get(reportItems, '_id', '-') || '-';
  const reportExported = _.get(reportItems, 'is_exported', false);

  const [eventChange, setEventChange] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const forceData = _.get(reportItems, 'basic_information', {}) || {};

    form.setFieldsValue({ ...forceData });
  }, [reportItems]);

  useEffect(() => {
    if (formRequiredField) {
      form.submit();
    }
  }, [formRequiredField]);

  const onHandleValuesChange = () => {
    setEventChange(true);
    setFormRequiredField(false);
  };

  const finishForm = (values) => {
    if (formRequiredField) {
      setFormDataAcceptInConditionAll(true);
    } else {
      doServicesApply(values);
    }
  };

  const doServicesApply = (values) => {
    setFormLoading(true);
    const { date_range = [] } = values;

    const payload = {
      ...values,
      is_inquisitor: _.get(values, 'is_inquisitor', false) || false,
      start_date: date_range[0],
      end_date: date_range[1],
    };

    ReportStore.updateReport(
      {
        basic_information: payload,
      },
      reportId
    )
      .then(() => setEventChange(false))
      .finally(() => setFormLoading(false));
  };

  return (
    <Card ref={(el) => (iRef.current['ข้อมูลพื้นฐานการแจ้งเหตุ'] = el)}>
      <Spin spinning={formLoading}>
        <Text strong>ข้อมูลพื้นฐานการแจ้งเหตุ</Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={finishForm}
          onValuesChange={onHandleValuesChange}
          disabled={reportExported}
        >
          <Row className="gx-flex-row gx-mt-4" gutter={[16, 16]}>
            <Col span={16}>
              <Form.Item
                name="date_range"
                label="ช่วงเวลาเกิดเหตุ"
                rules={[{ required: formRequiredField, message: 'กรุณาเลือกช่วงเวลาเกิดเหตุ' }]}
              >
                <DatePickerISOHoC>
                  <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    className="gx-full-width"
                    placeholder={['ช่วงเวลาเริ่มต้น', 'ช่วงเวลาสิ้นสุด']}
                  />
                </DatePickerISOHoC>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="data_source"
                label="ที่มาของข้อมูล"
                rules={[{ required: formRequiredField, message: 'กรุณาเลือกที่มาของข้อมูล' }]}
              >
                <DataSourceSelectWidget />
              </Form.Item>
            </Col>

            <Col span={9}>
              <SuffixCheckbox>
                <Form.Item className="gx-mb-0 " name="is_inquisitor" valuePropName="checked">
                  <Checkbox>พนักงานสอบสวนบันทึกเอง</Checkbox>
                </Form.Item>
              </SuffixCheckbox>

              {/* <Space> */}
              <Form.Item
                name="recorder"
                label="ผู้บันทึกรายงาน"
                rules={[{ required: formRequiredField, message: 'กรุณาเลือกผู้บันทึกรายงาน' }]}
              >
                <PersonnelSelectWidget placeholder="เลือกผู้บันทึกรายงาน" />
              </Form.Item>
              {/* <Button className="gx-mt-1" type="primary">ระบุตัวเอง</Button> */}
              {/* </Space> */}
            </Col>

            <Col span={7}>
              <Form.Item
                label=""
                shouldUpdate={(prevValues, currentValues) => prevValues.is_inquisitor !== currentValues.is_inquisitor}
              >
                {({ getFieldValue }) => (
                  <Form.Item
                    name="inquisitor"
                    label="พนักงานสอบสวน"
                    rules={[
                      {
                        required: !getFieldValue('is_inquisitor'),
                        message: 'กรุณาเลือกพนักงานสอบสวน',
                      },
                    ]}
                  >
                    <PersonnelSelectWidget disabled={getFieldValue('is_inquisitor')} placeholder="เลือกพนักงานสอบสวน" />
                  </Form.Item>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Guarded {...guardedProps}>
            <Space className="gx-full-width gx-flex-end">
              <Button
                data-testid="basic-information-button-submit"
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
  );
};

export default observer(BasicInformation);
