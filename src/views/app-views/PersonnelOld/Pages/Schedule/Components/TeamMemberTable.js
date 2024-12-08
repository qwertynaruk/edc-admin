import CustomTable from 'components/shared-components/CustomTable';
import usePersonnel from 'hooks/services/usePersonnel';
import _ from 'lodash';
import { useMemo } from 'react';
import { renderPosition } from 'utils/stringRender';

const TeamMemberTable = (props) => {
  const { ids } = props;
  const { data: users, loading } = usePersonnel({
    params: {
      _id: _.compact(ids),
    },
  });
  const columns = [
    {
      title: 'ลำดับ',
      dataIndex: 'index',
    },
    {
      title: 'ยศ ชื่อ สกุล',
      dataIndex: 'name',
      render: (_, record) => {
        return `${record.dominate_abbreviation} ${record.first_name} ${record.last_name}`;
      },
    },
    {
      title: 'ตำแหน่ง',
      dataIndex: 'position',
      render: (_, record) => {
        return renderPosition(record);
      },
    },
    {
      title: 'นามเรียกขาน',
      dataIndex: 'middle_name',
    },
    {
      title: 'เบอร์โทร',
      dataIndex: 'phone_number',
    },
  ];
  const dataSource = useMemo(() => {
    if (_.isEmpty(users)) return [];
    return users?.map((x, i) => ({ ...x, index: i + 1 }));
  }, [users]);
  return (
    <CustomTable
      columns={columns}
      loading={loading}
      dataSource={dataSource}
      pagination={false}
      rowSelection={
        props.onRowSelect && {
          type: 'checkbox',
          selectedRowKeys: props.value,
          onChange: props.onRowSelect,
        }
      }
    />
  );
};

export default TeamMemberTable;
