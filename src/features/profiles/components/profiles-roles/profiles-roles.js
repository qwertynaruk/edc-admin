import { Table } from 'antd';
import TableHeros from 'components/shared-components/TableHeros';

export function ProfilesRoles() {
  const columns = [
    Table.EXPAND_COLUMN,
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
  ];

  return <TableHeros columns={columns} />;
}
