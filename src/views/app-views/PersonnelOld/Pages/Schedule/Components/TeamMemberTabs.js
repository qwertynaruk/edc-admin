import { Tabs } from 'antd';
import useTeams from 'hooks/services/useTeams';
import TeamMemberTable from './TeamMemberTable';

const TeamMemberTabs = (props) => {
  const { agencies = [], dutyTeams = {} } = props;
  const { data: teams } = useTeams({
    params: {
      _ids: Object.keys(dutyTeams),
    },
  });
  return (
    <Tabs className="with-extra-hightlight">
      {agencies.map((agencyId) => {
        const team = teams.find((team) => team._id === agencyId) || {};
        return (
          <Tabs.TabPane key={agencyId} tab={team.team_name}>
            <TeamMemberTable ids={dutyTeams[agencyId]} />
          </Tabs.TabPane>
        );
      })}
    </Tabs>
  );
};

export default TeamMemberTabs;
