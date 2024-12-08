import { useState } from 'react';
import _ from 'lodash';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Form, Row, Select, Space, Typography } from 'antd';
import DatePicker from 'components/shared-components/DatePicker';

import OffenseModal from '../OffenseModal';
import { SuffixCheckbox } from 'utils/style-js';

import DatePickerISOHoC from 'components/shared-components/DatePickerISOHoC';
import MasterSelectWidget from 'components/shared-components/MasterSelectWidget';

const { RangePicker } = DatePicker;

const OffenseComplexForm = ({
  form,
  offenseFieldList = [],
  setOffenseFieldList = () => {},
  viewMode = 'edit',
  canAppend = true,
}) => {
  const [visibleOffenseModal, setVisibleOffenseModal] = useState(false);

  const onSelectedOffense = (el) => {
    const newPayload = offenseFieldList.concat(el);

    setOffenseFieldList(newPayload);
  };

  const removeOffenseFieldList = (el) => {
    const _psForm = form.getFieldValue('offense_detail');

    if (_psForm) {
      const newForm = _psForm.filter((_, _index) => _index !== el);
      form.setFieldsValue({ offense_detail: newForm });
    }

    const newPayload = offenseFieldList.filter((_, _index) => _index !== el);
    setOffenseFieldList(newPayload);
  };

  return (
    <>
      {offenseFieldList.map((ss, _index) => (
        <Card
          key={_index}
          title={
            <Space className="gx-full-width gx-space-between">
              <Typography.Text style={{ fontSize: 14 }}>ฐานความผิด ({_index + 1})</Typography.Text>
              {canAppend && (
                <Button
                  ghost
                  onClick={() => removeOffenseFieldList(_index)}
                  style={{ height: 20, lineHeight: 'unset' }}
                >
                  <DeleteOutlined />
                </Button>
              )}
            </Space>
          }
        >
          <Card>
            <Space direction="vertical">
              <Space size={25}>
                <Typography.Paragraph>
                  <Typography.Text className="gx-text-level-0 gx-mr-2">ประเภทกฎหมาย :</Typography.Text>
                  <Typography.Text>{_.get(ss, 'law_type', '-')}</Typography.Text>
                </Typography.Paragraph>

                <Typography.Paragraph>
                  <Typography.Text className="gx-text-level-0 gx-mr-2">ข้อกฎหมาย :</Typography.Text>
                  <Typography.Text>{_.get(ss, 'law_name', '-')}</Typography.Text>
                </Typography.Paragraph>
              </Space>

              <Typography.Paragraph>
                <Typography.Text className="gx-text-level-0 gx-mr-2">หมวด :</Typography.Text>
                <Typography.Text>{_.get(ss, 'category', '-')}</Typography.Text>
              </Typography.Paragraph>

              <Typography.Paragraph>
                <Typography.Text className="gx-text-level-0 gx-mr-2">ข้อหา :</Typography.Text>
                <Typography.Text>{_.get(ss, 'plaint', '-')}</Typography.Text>
              </Typography.Paragraph>

              <Space size={25}>
                <Typography.Paragraph>
                  <Typography.Text className="gx-text-level-0 gx-mr-2">มาตราข้อหา :</Typography.Text>
                  <Typography.Text>{_.get(ss, 'section_article', '-')}</Typography.Text>
                </Typography.Paragraph>
                <Typography.Paragraph>
                  <Typography.Text className="gx-text-level-0 gx-mr-2">มาตราโทษ :</Typography.Text>
                  <Typography.Text>{_.get(ss, 'section_penalty', '-')}</Typography.Text>
                </Typography.Paragraph>
              </Space>

              <Typography.Paragraph>
                <Typography.Text className="gx-text-level-0 gx-mr-2">ระวางโทษ :</Typography.Text>
                <Typography.Text>{_.get(ss, 'penalty', '-')}</Typography.Text>
              </Typography.Paragraph>
            </Space>
          </Card>

          {viewMode === 'edit' && (
            <Row className="gx-flex-row" gutter={[16, 16]}>
              <Col span={24}>
                <SuffixCheckbox>
                  <Form.Item name={['offense_detail', _index, 'is_date']} valuePropName="checked">
                    <Checkbox>ไม่ทราบวันที่ทำความผิด</Checkbox>
                  </Form.Item>
                </SuffixCheckbox>

                <Form.Item shouldUpdate>
                  {() => (
                    <Form.Item
                      name={['offense_detail', _index, 'period_date']}
                      label="วันเวลาที่ทำความผิด ถึงวันเวลาที่สิ้นสุดการทำความผิด"
                    >
                      <DatePickerISOHoC>
                        <RangePicker
                          className="gx-full-width"
                          placeholder={['ช่วงเวลาเริ่มต้น', 'ช่วงเวลาสิ้นสุด']}
                          disabled={form.getFieldValue(['offense_detail', _index, 'is_date'])}
                        />
                      </DatePickerISOHoC>
                    </Form.Item>
                  )}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name={['offense_detail', _index, 'prefix']}
                  label="คำนำหน้าความผิด"
                  rules={[{ required: false, message: 'กรุณาเลือกคำนำหน้าความผิด' }]}
                >
                  <Select
                    placeholder="เลือกคำนำหน้าความผิด"
                    options={[
                      {
                        label: 'ตัวการ',
                        value: 'ตัวการ',
                      },
                      {
                        label: 'ร่วมกัน',
                        value: 'ร่วมกัน',
                      },
                      {
                        label: 'สมคบ',
                        value: 'สมคบ',
                      },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name={['offense_detail', _index, 'weapon']} label="การใช้กำลัง/อาวุธ ที่เกี่ยวข้อง">
                  <MasterSelectWidget showSearch placeholder="เลือกการใช้กำลัง/อาวุธ ที่เกี่ยวข้อง" category="69" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name={['offense_detail', _index, 'criminal_method']} label="แผนประทุษกรรม">
                  <MasterSelectWidget showSearch placeholder="เลือกแผนประทุษกรรม" category="70" />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Card>
      ))}

      {canAppend && (
        <Button type="primary" onClick={() => setVisibleOffenseModal(true)}>
          เพิ่มฐานความผิด
        </Button>
      )}

      <OffenseModal
        visible={visibleOffenseModal}
        setVisible={(ss) => setVisibleOffenseModal(ss)}
        onSelected={(ss) => onSelectedOffense(ss)}
      />
    </>
  );
};

export default OffenseComplexForm;
