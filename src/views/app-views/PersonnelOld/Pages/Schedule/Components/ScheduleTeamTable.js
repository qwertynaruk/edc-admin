import { Space } from 'antd';
import CustomTable from 'components/shared-components/CustomTable';
import useTeams from 'hooks/services/useTeams';
import { useMemo } from 'react';
import moment from 'moment';
import { shiftDetailGroupByDate } from 'utils/dataTranformer';

const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
const ThaiDateFormatter = new Intl.DateTimeFormat('th-TH', options);
const format = 'HH:mm';

const ScheduleTeamTable = (props) => {
  const { shift, shiftDetail, dutyTeams = {} } = props;
  const { data: teams, loading } = useTeams({
    params: {
      _ids: Object.keys(dutyTeams),
    },
  });
  const columns = useMemo(() => {
    return [
      {
        title: 'วัน เดือน ปี',
        dataIndex: 'date',
      },
      ...shift.map((shift, index) => {
        return {
          title: (
            <Space direction="vertical">
              <span>ผลัด {index + 1}</span>
              <span>
                เวลา {moment.utc(shift.start).utcOffset('+07:00').format(format)} -{' '}
                {moment.utc(shift.end).utcOffset('+07:00').format(format)} น.
              </span>
            </Space>
          ),
          dataIndex: `shift_${index + 1}`,
        };
      }),
    ];
  }, [shift]);

  const dataSource = useMemo(() => {
    if (!shiftDetail) return [];
    if (!teams) return [];
    const groupedShiftDetail = shiftDetailGroupByDate(shiftDetail);
    return Object.keys(groupedShiftDetail)
      .sort()
      .map((date) => {
        const shiftTeams = groupedShiftDetail[date];
        const item = {
          _id: date,
          date: ThaiDateFormatter.format(new Date(date)),
        };
        shiftTeams.forEach((team, index) => {
          item[`shift_${index + 1}`] = teams.find((item) => item._id === team)?.team_name;
        });
        return item;
      });
  }, [shiftDetail, teams]);

  return <CustomTable loading={loading} columns={columns} dataSource={dataSource} pagination={false} />;
};

export default ScheduleTeamTable;
