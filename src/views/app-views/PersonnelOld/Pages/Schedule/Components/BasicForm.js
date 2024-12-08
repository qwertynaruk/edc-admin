import { Card, Col, Form, Input, InputNumber, Row, TimePicker, Typography } from 'antd';
import DatePicker from 'components/shared-components/DatePicker';
import { ShiftWrapper, StartStopWrapper } from './Wrapper';
import moment from 'moment';
import DatePickerISOHoC from 'components/shared-components/DatePickerISOHoC';
import produce from 'immer';
import DepartmentSelectWidget from 'components/shared-components/DepartmentSelectWidget';

const { Title } = Typography;
const { RangePicker } = DatePicker;

export const format = 'HH:mm';

function disabledDate(current) {
  const monthStart = moment().subtract(1, 'day');
  const monthEnd = moment().add(1, 'month');
  return !(monthStart.isBefore(current, 'day') && monthEnd.isAfter(current));
}

const BasicForm = () => {
  return (
    <>
      <Title level={5}>รายละเอียด</Title>
      <Form.Item name="department" hidden>
        <Input />
      </Form.Item>
      <Card>
        <Row gutter={16} className="gx-flex-row">
          <Col span={16}>
            <Form.Item
              label="ชื่อตารางปฏิบัติหน้าที่"
              name="duty_name"
              rules={[
                {
                  required: true,
                  message: 'กรุณากรอกชื่อตารางปฏิบัติหน้าที่',
                },
              ]}
            >
              <Input placeholder="ชื่อตารางปฏิบัติหน้าที่" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item shouldUpdate={(p, c) => p.department_ids !== c.department_ids} noStyle>
              {({ setFieldValue, setFieldsValue }) => {
                return (
                  <Form.Item
                    name="department_ids"
                    label="ฝ่ายงาน"
                    rules={[
                      {
                        required: true,
                        message: 'กรุณาเลือกฝ่ายงาน',
                      },
                    ]}
                  >
                    <DepartmentSelectWidget
                      placeholder="เลือกฝ่ายงาน"
                      onChange={(_, department) => {
                        // setFieldValue('agencies', [{}]);
                        setFieldsValue({ agencies: [{}], department });
                      }}
                    />
                  </Form.Item>
                );
              }}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} className="gx-flex-row">
          <Col span={16}>
            <Form.Item
              label="วันที่เริ่มถึงวันที่สิ้นสุดปฏิบัติหน้าที่"
              name="date"
              rules={[
                {
                  required: true,
                  message: 'กรุณาเลือกวันที่เริ่มถึงวันที่สิ้นสุดปฏิบัติหน้าที่',
                },
              ]}
            >
              <DatePickerISOHoC>
                <RangePicker
                  className="gx-w-100"
                  disabledDate={disabledDate}
                  placeholder={['วันที่เริ่มใช้งาน', 'วันที่สิ้นสุดการใช้งาน']}
                />
              </DatePickerISOHoC>
            </Form.Item>
          </Col>
          <Col span={8}>
            <StartStopWrapper>
              <Form.Item
                label="จำนวนผลัด"
                name="shift_count"
                style={{ minHeight: '100px' }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกจำนวนผลัด',
                  },
                ]}
              >
                <InputNumber type="number" min={1} max={24} placeholder="กรอกจำนวนผลัด" className="gx-w-100" />
              </Form.Item>
              <Form.Item
                label="ชั่วโมงการทำงาน"
                name="working_hours"
                style={{ minHeight: '100px' }}
                required
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, workingHours) {
                      const shiftNumber = getFieldValue('shift_count');
                      const isValid24Hour = shiftNumber * workingHours === 24;
                      if (isValid24Hour) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('จำนวนผลัด X ชั่วโมงการทำงานไม่ครบ 24 ชั่วโมง'));
                    },
                  }),
                ]}
              >
                <InputNumber type="number" min={1} max={24} placeholder="กรอกชั่วโมงการทำงาน" className="gx-w-100" />
              </Form.Item>
            </StartStopWrapper>
          </Col>
        </Row>
      </Card>
      <Form.Item dependencies={['shift_count', 'working_hours', 'shift']} noStyle>
        {({ getFieldValue, setFieldsValue, resetFields }) => {
          const shiftNumber = getFieldValue('shift_count');
          const workingHours = getFieldValue('working_hours');
          if (!shiftNumber || !workingHours) {
            return null;
          }
          if (shiftNumber * workingHours !== 24) {
            return null;
          }
          resetFields(['shift']);
          const startTime = moment('00:00', format).utcOffset('+07:00');
          return (
            <>
              <Title level={5}>ช่วงเวลาในแต่ละผลัด</Title>
              <Card>
                <Row gutter={16} className="gx-flex-row">
                  {Array(shiftNumber)
                    .fill(0)
                    .map((_, index) => {
                      const start = startTime.clone().add(index * workingHours, 'hours');
                      const end = start.clone().add(workingHours, 'hours');
                      return (
                        <Col key={index} span={8}>
                          <ShiftWrapper>
                            <Form.Item label="ผลัด">
                              <Input defaultValue={index + 1} disabled />
                            </Form.Item>
                            <StartStopWrapper className="gx-w-100">
                              <Form.Item
                                name={['shift', index, 'start']}
                                label="เวลาเริ่มต้น"
                                initialValue={start}
                                rules={[
                                  {
                                    required: true,
                                    message: 'กรุณาเลือกเวลาเริ่มต้น',
                                  },
                                ]}
                              >
                                <TimePicker
                                  placeholder="กรุณากรอกเวลาเริ่มต้น"
                                  minuteStep={60}
                                  format={format}
                                  suffixIcon={false}
                                  showNow={false}
                                  disabled={index !== 0}
                                  className="gx-w-100"
                                  onChange={(value) => {
                                    if (index !== 0) return;
                                    const shift = getFieldValue('shift');
                                    const nextShift = produce(shift, (draft) => {
                                      const firstShiftEnd = value.clone().add(workingHours, 'hours');
                                      draft[index].end = firstShiftEnd;
                                      for (let i = index + 1; i < shiftNumber; i++) {
                                        draft[i].start = draft[i - 1].end;
                                        draft[i].end = draft[i].start.clone().add(workingHours, 'hours');
                                      }
                                    });
                                    setFieldsValue({
                                      shift: nextShift,
                                    });
                                  }}
                                />
                              </Form.Item>
                              -
                              <Form.Item name={['shift', index, 'end']} label="เวลาที่สิ้นสุด" initialValue={end}>
                                <TimePicker
                                  placeholder="กรุณากรอกเวลาที่สิ้นสุด"
                                  minuteStep={60}
                                  format={format}
                                  suffixIcon={false}
                                  showNow={false}
                                  disabled
                                  className="gx-w-100"
                                />
                              </Form.Item>
                            </StartStopWrapper>
                          </ShiftWrapper>
                        </Col>
                      );
                    })}
                </Row>
              </Card>
            </>
          );
        }}
      </Form.Item>
    </>
  );
};

export default BasicForm;
