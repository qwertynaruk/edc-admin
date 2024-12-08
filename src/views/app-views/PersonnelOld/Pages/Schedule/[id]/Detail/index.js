import { Button, Card, Space, Tabs, Typography } from 'antd';
import {
  transformPayloadDutyInfosIntoShiftDetailFormValue,
  transformPayloadDutyInfosIntoShiftFormValue,
  transformPayloadDutyTeamsIntoAgenciesFormValue,
  transformPayloadDutyTeamsIntoDutyTeamsFormValue,
} from 'utils/dataTranformer';
import { useNavigate, useParams } from 'react-router-dom';

import ExportScheduleButton from '../../Components/ExportScheduleButton';
import Guarded from 'components/shared-components/Guarded';
import LabelShowText from 'components/shared-components/LabelShowText';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import SchedulePersonTable from '../../Components/SchedulePersonTable';
import ScheduleTeamTable from '../../Components/ScheduleTeamTable';
import TeamMemberTabs from '../../Components/TeamMemberTabs';
import _ from 'lodash';
import { renderDate } from 'utils/stringRender';
import useDuty from 'hooks/services/useDuty';
import { useMemo } from 'react';

const { Title } = Typography;

const hasPersonnelDutyInfos = (duty) => {
  if (!duty) return false;
  if (!duty.personnel_duty_infos) return false;
  return true;
};

const hasDutyTeams = (duty) => {
  if (!duty) return false;
  if (!duty.duty_teams) return false;
  return true;
};

const IdDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: duty, loading } = useDuty({ params: { duty_id: id } });

  const shift = useMemo(() => {
    if (!hasPersonnelDutyInfos(duty)) return [];
    return transformPayloadDutyInfosIntoShiftFormValue(duty.personnel_duty_infos);
  }, [duty]);

  const shiftDetail = useMemo(() => {
    if (!hasPersonnelDutyInfos(duty)) return [];
    return transformPayloadDutyInfosIntoShiftDetailFormValue(duty.personnel_duty_infos);
  }, [duty]);

  const agencies = useMemo(() => {
    if (!hasDutyTeams(duty)) return [];
    return transformPayloadDutyTeamsIntoAgenciesFormValue(duty.duty_teams);
  }, [duty]);

  const dutyTeams = useMemo(() => {
    if (!hasDutyTeams(duty)) return {};
    return transformPayloadDutyTeamsIntoDutyTeamsFormValue(duty.duty_teams);
  }, [duty]);

  const person = useMemo(() => {
    if (!duty) return false;
    return duty.type === 'บุคลากร';
  }, [duty]);

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'ตารางปฏิบัติหน้าที่', subpath: 'ดู' }}>
        <Space>
          <Button ghost onClick={() => navigate('history')}>
            ประวัติ
          </Button>
          <Guarded
            query={{
              group: 'Personnel',
              type: 'ตารางปฏิบัติหน้าที่',
              name: 'แก้ไขข้อมูลตารางปฏิบัติหน้าที่',
            }}
          >
            <Button ghost onClick={() => navigate('edit')}>
              แก้ไข
            </Button>
          </Guarded>
        </Space>
      </PageBreadcrumb>
      <Card loading={loading}>
        <Title level={5}>ข้อมูลตารางปฏิบัติหน้าที่</Title>
        <LabelShowText labelText="ชื่อตารางปฏิบัติหน้าที่" value={_.get(duty, 'duty_name', '-')} />
        <LabelShowText labelText="ฝ่ายงาน" value={_.get(duty, 'department.0.name', '-')} />
        <Space>
          <LabelShowText
            labelText="วันที่เริ่มถึงวันที่สิ้นสุดปฏิบัติหน้าที่"
            value={renderDate(_.get(duty, 'start_time'))}
          />
          <LabelShowText labelText="ถึง" value={renderDate(_.get(duty, 'end_time'))} />
        </Space>
      </Card>
      <Card loading={loading}>
        <Guarded
          query={{
            group: 'Personnel',
            type: 'ตารางปฏิบัติหน้าที่',
            name: 'แก้ไขข้อมูลตารางปฏิบัติหน้าที่',
          }}
        >
          <Space className="gx-justify-content-end">
            <ExportScheduleButton person={person} shift={shift} shiftDetail={shiftDetail} dutyTeams={dutyTeams} />
          </Space>
        </Guarded>
        <Tabs className="with-extra-hightlight">
          <Tabs.TabPane key="ตารางปฏิบัติหน้าที่" tab="ตารางปฏิบัติหน้าที่">
            {!person && <ScheduleTeamTable shift={shift} shiftDetail={shiftDetail} dutyTeams={dutyTeams} />}
            {person && <SchedulePersonTable shift={shift} shiftDetail={shiftDetail} />}
          </Tabs.TabPane>
          {!person && (
            <Tabs.TabPane key="ข้อมูลชุดปฏิบัติการ" tab="ข้อมูลชุดปฏิบัติการ">
              <TeamMemberTabs agencies={agencies} dutyTeams={dutyTeams} />
            </Tabs.TabPane>
          )}
        </Tabs>
      </Card>
    </>
  );
};

export default IdDetail;
