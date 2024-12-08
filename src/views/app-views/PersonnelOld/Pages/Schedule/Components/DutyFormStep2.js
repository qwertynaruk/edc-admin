import { Button, Card, Col, Form, Row, Space, Typography } from 'antd';
import CollapseFromData from 'components/shared-components/CollapseFromData';
import TeamSelectWidget from 'components/shared-components/TeamSelectWidget';
import React, { useCallback, useContext, useEffect } from 'react';
import styled from '@emotion/styled';
import moment from 'moment';
import { format } from './BasicForm';
import BasicScheduleInformationCard from './BasicScheduleInformationCard';
import NoMinHeightFormItem from './NoMinHeightFormItem';
import DutyFormStepsCard from './DutyFormStepsCard';
import PersonnelSelectWidget from 'components/shared-components/PersonnelSelectWidget';
import { DutyFormContext } from './DutyForm';
import { CheckCircleOutlined } from '@ant-design/icons';
import _ from 'lodash';

const { Title } = Typography;

const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

const ThaiDateFormatter = new Intl.DateTimeFormat('th-TH', options);

const RowOverrideFix = styled(Row)`
  .ant-col-offset-2 {
    margin-left: 8.33333333% !important;
  }
`;

const getShiftKey = (date) => {
  return moment.utc(date).utcOffset('+07:00').format('YYYY-MM-DD');
};

const isFilled = (props) => {
  const { date, shift, currentDetail } = props;
  if (!date && !shift) return false;
  if (!currentDetail) return false;
  return shift.length === _.compact(currentDetail[getShiftKey(date)]).length;
};

const ShiftSelector = (props) => {
  const { shift, selectableTeam, date, person, category } = props;
  return (
    <RowOverrideFix>
      <Col offset={2} span={14}>
        {shift.map((item, index) => {
          const label = `ผลัด ${index + 1}  เวลา ${item.start.utcOffset('+07:00').format(format)} - ${item.end
            .utcOffset('+07:00')
            .format(format)} น.`;
          const name = ['shift_detail', getShiftKey(date), index];
          return (
            <React.Fragment key={index}>
              {person ? (
                <Form.Item label={label} name={name}>
                  <PersonnelSelectWidget category={category} placeholder="เลือกเจ้าหน้าที่" />
                </Form.Item>
              ) : (
                <Form.Item label={label} name={name}>
                  <TeamSelectWidget only={selectableTeam} placeholder="เลือกชุดปฏิบัติการ" />
                </Form.Item>
              )}
            </React.Fragment>
          );
        })}
      </Col>
    </RowOverrideFix>
  );
};

const DutyFormStep2 = (props) => {
  const { person, step, record, edit } = useContext(DutyFormContext);
  const { shift, agencies, date, department } = record;

  const [form] = Form.useForm();

  const getData = useCallback(
    (currentDetail) => {
      if (!date) return [];
      if (date.length < 2) return [];
      const start = moment.utc(date[0]);
      const end = moment.utc(date[1]);
      const diff = end.diff(start, 'days');
      return Array.from(Array(diff + 1)).map((__, index) => {
        const date = start.clone().add(index, 'days');
        const dateISOString = date.toISOString();
        return {
          key: dateISOString,
          header: (
            <Space>
              <span>{ThaiDateFormatter.format(date.toDate())}</span>
              {isFilled({
                date,
                shift,
                currentDetail,
              }) ? (
                <CheckCircleOutlined style={{ color: '#fff' }} />
              ) : null}
            </Space>
          ),
          description: (
            <ShiftSelector
              date={dateISOString}
              shift={shift}
              selectableTeam={agencies}
              person={person}
              category={_.get(department, 'name')}
            />
          ),
        };
      });
    },
    [date, shift, agencies, person, department]
  );

  useEffect(() => {
    if (!record) return;
    form.setFieldsValue(record);
  }, [form, record]);

  return (
    <Form form={form} name="step2">
      <BasicScheduleInformationCard record={record} />
      <DutyFormStepsCard person={person} step={step} />
      <Card>
        <Title level={5}>ข้อมูลชุดปฏิบัติการ</Title>
        <Form.Item shouldUpdate>
          {({ getFieldValue }) => {
            return <CollapseFromData forceRender data={getData(getFieldValue('shift_detail'))} />;
          }}
        </Form.Item>
        <NoMinHeightFormItem
          shouldUpdate
          name={'_'}
          rules={[
            ({ getFieldValue }) => ({
              validator() {
                const diff = moment(date[1]).diff(moment(date[0]), 'days');
                const isNotSelect = Array.from(Array(diff + 1)).some((_, index) => {
                  const cloneDate = moment.utc(date[0]).clone().add(index, 'days');
                  return !isFilled({
                    date: cloneDate,
                    shift,
                    currentDetail: getFieldValue('shift_detail'),
                  });
                });
                if (isNotSelect) {
                  return Promise.reject(
                    new Error('ไม่สามารถไปขั้นตอนถัดไปได้เนื่องจาก มีช่วงเวลายังไม่ได้เลือกชุดปฏิบัติการ')
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
          className="gx-m-0"
        >
          <></>
        </NoMinHeightFormItem>
        <Space className="gx-justify-content-end">
          <Space>
            {edit ? <Button onClick={props.onCancel}>ยกเลิก</Button> : <Button onClick={props.onBack}>ย้อนกลับ</Button>}
            <Button type="primary" htmlType="submit">
              ถัดไป
            </Button>
          </Space>
        </Space>
      </Card>
    </Form>
  );
};

export default DutyFormStep2;
