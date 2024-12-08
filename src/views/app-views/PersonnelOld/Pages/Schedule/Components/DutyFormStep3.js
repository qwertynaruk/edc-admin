import { Button, Card, Form, Space, Tabs } from 'antd';
import { useContext } from 'react';
import BasicScheduleInformationCard from './BasicScheduleInformationCard';
import { DutyFormContext } from './DutyForm';
import DutyFormStepsCard from './DutyFormStepsCard';
import SchedulePersonTable from './SchedulePersonTable';
import ScheduleTeamTable from './ScheduleTeamTable';
import TeamMemberTabs from './TeamMemberTabs';

const DutyFormStep3 = (props) => {
  const { person, step, record, actionLoading } = useContext(DutyFormContext);
  const [form] = Form.useForm();
  const { shift, shift_detail: shiftDetail, agencies, duty_teams: dutyTeams } = record;

  return (
    <Form form={form} name="step3">
      <BasicScheduleInformationCard record={record} />
      <DutyFormStepsCard step={step} person={person} />
      <Card>
        <Tabs className="with-extra-hightlight">
          <Tabs.TabPane key="ตารางปฏิบัติหน้าที่" tab="ตารางปฏิบัติหน้าที่">
            {person ? (
              <SchedulePersonTable shift={shift} shiftDetail={shiftDetail} />
            ) : (
              <ScheduleTeamTable shift={shift} shiftDetail={shiftDetail} dutyTeams={dutyTeams} />
            )}
          </Tabs.TabPane>
          {!person && (
            <Tabs.TabPane key="ข้อมูลชุดปฏิบัติการ" tab="ข้อมูลชุดปฏิบัติการ">
              <TeamMemberTabs agencies={agencies} dutyTeams={dutyTeams} />
            </Tabs.TabPane>
          )}
        </Tabs>
        <Space className="gx-justify-content-end">
          <Space>
            <Button onClick={props.onBack}>ย้อนกลับ</Button>
            <Button type="primary" htmlType="submit" loading={actionLoading}>
              บันทึก
            </Button>
          </Space>
        </Space>
      </Card>
    </Form>
  );
};

export default DutyFormStep3;
