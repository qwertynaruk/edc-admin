import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, Card, Form, Space, Steps, Tabs, Typography } from 'antd';
import useTeams from 'hooks/services/useTeams';
import _ from 'lodash';
import { useContext, useEffect } from 'react';
import BasicScheduleInformationCard from './BasicScheduleInformationCard';
import { DutyFormContext } from './DutyForm';
import DutyFormStepsCard from './DutyFormStepsCard';
import NoMinHeightFormItem from './NoMinHeightFormItem';
import TeamMemberTable from './TeamMemberTable';

const { Step } = Steps;
const { Title } = Typography;

const TabName = (props) => {
  const { person = false, isSelected = false, title } = props;
  return (
    <Space>
      <span>{title}</span>
      {isSelected && <CheckCircleOutlined style={{ color: '#fff' }} />}
    </Space>
  );
};

const DutyFormStep1 = (props) => {
  const { person, step, record, edit } = useContext(DutyFormContext);
  const { data: teams, loading } = useTeams({
    params: {
      _ids: record?.agencies,
    },
  });
  const [form] = Form.useForm();
  const agencies = _.get(record, 'agencies', []);

  const findTeamById = (id) => {
    return teams?.find((team) => team._id === id) || {};
  };

  const onRowSelect = (agencyId) => {
    return (selectedRowKeys) => {
      form.setFieldValue(['duty_teams', agencyId], selectedRowKeys);
    };
  };

  useEffect(() => {
    if (!record) return;
    form.setFieldsValue(record);
  }, [form, record]);

  return (
    <Form form={form} name="step1" layout="vertical">
      <BasicScheduleInformationCard record={record} />
      <DutyFormStepsCard person={person} step={step} />
      <Card loading={loading}>
        <Title level={5}>ข้อมูลชุดปฏิบัติการ</Title>
        <Tabs className="with-extra-hightlight">
          {agencies.map((agencyId) => {
            const team = findTeamById(agencyId);
            return (
              <Tabs.TabPane
                key={agencyId}
                tab={
                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                      const selected = getFieldValue(['duty_teams', agencyId]);
                      const isSelected = selected && selected.length > 0;
                      return <TabName title={team.team_name} isSelected={isSelected} />;
                    }}
                  </Form.Item>
                }
                forceRender
              >
                {team.operation_officers && (
                  <Form.Item noStyle name={['duty_teams', agencyId]} shouldUpdate>
                    <TeamMemberTable ids={team.operation_officers} onRowSelect={onRowSelect(agencyId)} />
                  </Form.Item>
                )}
              </Tabs.TabPane>
            );
          })}
        </Tabs>
        <NoMinHeightFormItem
          name={'_'}
          rules={[
            ({ getFieldValue }) => ({
              validator() {
                const isNotSelect = agencies.some((id) => _.isEmpty(getFieldValue(['duty_teams', id])));
                if (isNotSelect) {
                  return Promise.reject(
                    new Error('ไม่สามารถไปขั้นตอนถัดไปได้เนื่องจาก มีชุดปฏิบัติการที่ยังไม่ได้เลือกเจ้าหน้าที่')
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
          shouldUpdate
          className="gx-m-0"
        >
          <></>
        </NoMinHeightFormItem>
        <Space className="gx-justify-content-end">
          <Space>
            {edit && <Button onClick={props.onCancel}>ยกเลิก</Button>}
            {!edit && <Button onClick={props.onBack}>ย้อนกลับ</Button>}
            <Button type="primary" htmlType="submit">
              ถัดไป
            </Button>
          </Space>
        </Space>
      </Card>
    </Form>
  );
};

export default DutyFormStep1;
