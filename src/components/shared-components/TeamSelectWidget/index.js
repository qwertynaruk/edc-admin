import useTeams from 'hooks/services/useTeams';
import CustomSelect from '../CustomSelect';

const TeamSelectWidget = (props) => {
  const { json = false, disableItems, agency, only, ...otherProps } = props;
  const { data, loading } = useTeams();

  if (loading) {
    return <CustomSelect placeholder="กำลังโหลดข้อมูล" loading disabled />;
  }
  if (!data) {
    return <CustomSelect placeholder="เลือกชุดปฏิบัติการ" />;
  }
  const options = data
    .filter((item) => {
      if (only) {
        return only.includes(item._id);
      }
      return true;
    })
    .filter((item) => {
      if (!agency) return true;
      return item.main_agency === agency;
    })
    .map((team) => {
      return {
        ...team,
        label: team.team_name,
        disabled: disableItems ? disableItems.includes(team._id) : false,
        value: json ? JSON.stringify(team) : team._id,
      };
    });
  return <CustomSelect placeholder="เลือกชุดปฏิบัติการ" options={options} {...otherProps} />;
};
export default TeamSelectWidget;
