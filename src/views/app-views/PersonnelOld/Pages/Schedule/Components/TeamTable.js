import CustomTable from 'components/shared-components/CustomTable';
import useTeams from 'hooks/services/useTeams';
import _ from 'lodash';
import { useMemo } from 'react';

const TeamTable = (props) => {
  const { ids } = props;
  const { data: teams, loading } = useTeams({
    params: {
      _ids: ids,
    },
  });
  const columns = [
    {
      title: 'ลำดับ',
      dataIndex: 'index',
      width: '20%',
    },
    {
      title: 'ชื่อชุดปฏิบัติการ',
      dataIndex: 'team_name',
      width: '80%',
      render: (name) => {
        return name || '-';
      },
    },
  ];
  const dataSource = useMemo(() => {
    if (_.isEmpty(teams)) return [];
    return teams?.map((x, i) => ({ ...x, index: i + 1 }));
  }, [teams]);
  return <CustomTable columns={columns} loading={loading} dataSource={dataSource} pagination={false} />;
};

export default TeamTable;
