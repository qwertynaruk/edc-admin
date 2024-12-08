import { Space, Typography } from 'antd';

import { SpStatusTag } from 'features/shared';
import TableHeros from 'components/shared-components/TableHeros';

export function LostFoundRelateItems() {
  const dataSource = [
    {
      id: '1',
      missingId: 'CLA20250100002',
      name: 'ธนวรรธน์ คมคาย',
      date: '17 Oct 2024 - 11:00',
      status: 'open',
    },
  ];

  const columns = [
    {
      title: (
        <Space direction="vertical">
          <Typography.Text>#Missing ID</Typography.Text>
          <Typography.Text>Name</Typography.Text>
        </Space>
      ),
      key: 'name',
      render: (items) => (
        <Space direction="vertical">
          <Typography.Text>{items.missingId}</Typography.Text>
          <Typography.Text>{items.name}</Typography.Text>
        </Space>
      ),
    },
    {
      title: (
        <Space direction="vertical">
          <Typography.Text>วันที่แจ้งหาย</Typography.Text>
          <Typography.Text>สถานะ</Typography.Text>
        </Space>
      ),
      key: 'age',
      render: (items) => (
        <Space direction="vertical">
          <Typography.Text>{items.date}</Typography.Text>
          <Typography.Text>
            <SpStatusTag statusName={items.status} />
          </Typography.Text>
        </Space>
      ),
    },
  ];

  return <TableHeros columns={columns} dataSource={dataSource} pagination={false} />;
}
