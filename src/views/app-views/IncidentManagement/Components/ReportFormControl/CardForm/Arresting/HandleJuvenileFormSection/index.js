import { Card, Checkbox, Col, Form, Row, Space, Typography } from 'antd';
import DatePicker from 'components/shared-components/DatePicker';
import DatePickerISOHoC from 'components/shared-components/DatePickerISOHoC';
import WYSIWYGV2 from 'components/shared-components/WYSIWYGV2';
import _ from 'lodash';
import MapAppendForm from 'views/app-views/MasterIndices/Components/MapAppendForm';
import PersonnelAutoField from '../PersonnelAutoField';
import TermList from '../TermConditionList.json';

const HandleJuvenileFormSection = ({
  form,
  isJuvenile = false,
  disabled = false,
  reportItems = {},
  setEventChange = () => {},
}) => {
  const NoneJuvenileSection = () => {
    return (
      <>
        <Card>
          <Form.Item
            label={<Typography.Text strong>พฤติการณ์</Typography.Text>}
            rules={[{ required: true, message: 'กรุณาระบุรายละเอียด' }]}
            name="behaviour"
            className="gx-mb-0"
            initialValue={_.get(reportItems, 'arrest.behaviour', '')}
          >
            <WYSIWYGV2 readOnly={disabled} />
          </Form.Item>
        </Card>

        <Card>
          <Form.Item
            label={<Typography.Text strong>ขณะจับกุมผู้ต้องหาได้รับทราบข้อกล่าวหา และให้การ</Typography.Text>}
            rules={[{ required: true, message: 'กรุณาระบุรายละเอียด' }]}
            name="testimony"
            className="gx-mb-0"
            initialValue={_.get(reportItems, 'arrest.testimony', '')}
          >
            <WYSIWYGV2 readOnly={disabled} />
          </Form.Item>
        </Card>

        <Card>
          <Typography.Text strong>เหตุเกิดที่</Typography.Text>

          <div className="gx-mt-4">
            <MapAppendForm setEventChange={setEventChange} form={form} fieldName="venue" />
          </div>
        </Card>

        <Card>
          <Typography.Text strong>วันเวลาที่เกิดเหตุ</Typography.Text>
          <Row className="gx-mt-4" gutter={[16, 16]}>
            <Col span={16}>
              <Form.Item
                name="incident_date"
                label="วันเวลาที่เกิดเหตุ"
                rules={[{ required: true, message: 'กรุณาเลือกวันเวลาที่จับกุม' }]}
              >
                <DatePickerISOHoC>
                  <DatePicker showTime={{ format: 'HH:mm' }} placeholder="เลือกวันเวลา" className="gx-full-width" />
                </DatePickerISOHoC>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card>
          <Typography.Text strong>ผู้กล่าวหา</Typography.Text>
          <PersonnelAutoField setEventChange={setEventChange} form={form} fieldName="accuser" />
        </Card>

        <Card>
          <Typography.Text strong>พยาน</Typography.Text>
          <PersonnelAutoField setEventChange={setEventChange} form={form} fieldName="witness" />
        </Card>
      </>
    );
  };

  const JuvenileSection = () => {
    return (
      <>
        {TermList.juvenile_section.map((ss, _key) => (
          <Card key={_key}>
            <Typography.Text strong style={{ fontSize: 16 }}>
              {ss.name}
            </Typography.Text>

            <div className="gx-mt-2">
              <Form.Item className={_key + 1 < TermList.juvenile_section.length && 'gx-mb-0'} name={ss.value}>
                <Checkbox.Group
                  options={ss.child.map((_tx) => ({ label: _tx, value: _tx }))}
                  style={{ flexDirection: 'column', display: 'flex', lineHeight: '1.75em' }}
                />
              </Form.Item>
              {_key + 1 === TermList.juvenile_section.length && (
                <Typography.Text underline>กรณีอยู่ด้วยในขณะจับกุม / ในโอกาสแรกเท่าที่สามารถทำได้</Typography.Text>
              )}
            </div>
          </Card>
        ))}

        <Card>
          <Space direction="vertical">
            <Typography.Text style={{ paddingLeft: '2em' }}>
              ทำบันทึกการจับกุม โดยแจ้งข้อกล่าวหาและรายละเอียดเกี่ยวกับเหตุแห่งการจับให้ผู้ถูกจับทราบ และได้กระทำต่อหน้า
              ผู้ปกครอง บุคคลหรือผู้แทนองค์การซึ่งเด็กหรือเยาวชนอยู่ด้วย ในกรณีที่ขณะทำบันทึกมีบุคคลดังกล่าวอยู่ด้วย
            </Typography.Text>
            <Typography.Text style={{ paddingLeft: '2em' }}>
              ในการจับกุมและควบคุมได้กระทำโดยละมุนละม่อม
              โดยคำนึงถึงศักดิ์ศรีความเป็นมนุษย์และไม่เป็นการประจานมิได้ใช้วิธีการเกินกว่าที่จำเป็น
              เพื่อป้องกันการหลบหนีหรือเพื่อความปลอดภัยของเด็กหรือเยาวชนผู้ถูกจับหรือบุคคลอื่น
              และมีได้ใช้เครื่องพันธนาการแก่เด็ก
            </Typography.Text>
            <Typography.Text style={{ paddingLeft: '2em' }}>
              เจ้าหน้าที่ตำรวจผู้จับได้อ่านบันทึกให้ผู้ถูกจับฟังแล้วและผู้ถูกจับได้อ่านด้วยตนเองแล้ว
              รับว่าถูกต้องและได้มอบ สำเนาบันทึก การจับกุมให้แก่ผู้ถูกจับเรียบร้อย จึงให้ลงลายมือชื่อไว้เป็นหลักฐาน
            </Typography.Text>
          </Space>
        </Card>
      </>
    );
  };

  return isJuvenile ? <JuvenileSection /> : <NoneJuvenileSection />;
};

export default HandleJuvenileFormSection;
