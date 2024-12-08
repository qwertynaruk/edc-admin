import { Col, Empty, Form, Modal, Row, Skeleton } from 'antd';
import DatePicker from 'components/shared-components/DatePicker';
import CollapseFromData from 'components/shared-components/CollapseFromData';
import DatePickerISOHoC from 'components/shared-components/DatePickerISOHoC';
import useService from 'hooks/useService';
import { useMemo } from 'react';
import DutyService from 'services/DutyService';
import moment from 'moment';
import TeamMemberTable from 'views/app-views/PersonnelOld/Pages/Schedule/Components/TeamMemberTable';
import TeamTable from 'views/app-views/PersonnelOld/Pages/Schedule/Components/TeamTable';
import DepartmentSelectWidget from 'components/shared-components/DepartmentSelectWidget';

const { RangePicker } = DatePicker;

function DutiesCollapseContent(props) {
  const { teams = [], personnel = [] } = props;
  if (personnel.length === 0 && teams.length === 0) return <Empty />;
  return (
    <>
      {personnel.length === 0 ? null : <TeamMemberTable ids={personnel.map((person) => person.agent_id)} />}
      {teams.length === 0 ? null : <TeamTable ids={teams.map((team) => team.agent_id)} />}
    </>
  );
}

const DutiesCollapse = (props) => {
  const { dutyTime, departmentIds } = props;
  const [startTime, endTime] = dutyTime;
  const { data, loading } = useService(DutyService.duties, {
    params: {
      start_time: startTime.unix(),
      end_time: endTime.unix(),
      department_ids: departmentIds?.join(','),
    },
  });
  const duties = useMemo(() => {
    if (!data) return [];
    return data.map((duty) => {
      const ids = duty.personnel_by_duty.map((x) => x._id);
      const teams = duty.personnel_by_duty.filter((x) => x.agent_type === 'investigation_team');
      const personnel = duty.personnel_by_duty.filter((x) => x.agent_type === 'personnel');

      return {
        key: ids.join(''),
        header: duty.duty_name,
        description: <DutiesCollapseContent personnel={personnel} teams={teams} />,
      };
    });
  }, [data]);
  if (loading) return <Skeleton.Input className="gx-w-100" active={true} />;

  return <CollapseFromData data={duties} />;
};

const OnDutySchedule = (props) => {
  const { visible } = props;
  const [form] = Form.useForm();

  const onCancel = () => {
    if (props.onCancel) props.onCancel();
    form.resetFields();
    props.setVisible(false);
  };

  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <Modal
      centered
      visible={visible}
      width={'1000px'}
      title="ตารางปฏิบัติหน้าที่"
      style={{ marginTop: 20 }}
      onCancel={onCancel}
      destroyOnClose={true}
      footer={null}
    >
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Row gutter={16} className="gx-flex-row">
          <Col span={8}>
            <Form.Item label="วันเวลา" name="duty_time" initialValue={[moment(), moment()]}>
              <DatePickerISOHoC>
                <RangePicker
                  placeholder={['เลือกวันเวลาเริ่ม', 'เลือกเวลาสิ้นสุด']}
                  className="gx-w-100"
                  showTime={true}
                />
              </DatePickerISOHoC>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="เลือกฝ่าย" name="department_ids">
              {/* <MasterSelectWidget placeholder="เลือกฝ่ายงาน" category="78" mode="multiple" /> */}
              <DepartmentSelectWidget placeholder="เลือกฝ่ายงาน" mode="multiple" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item dependencies={['duty_time', 'department_ids']}>
          {({ getFieldValue }) => {
            const dutyTime = getFieldValue('duty_time');
            const departmentIds = getFieldValue('department_ids');
            return <DutiesCollapse dutyTime={dutyTime} departmentIds={departmentIds} />;
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OnDutySchedule;
