import { SpStatusTag } from 'features/shared';
import TableHeros from 'components/shared-components/TableHeros';
import { Typography } from 'antd';

export function LostFoundDetailClaimTable() {
  const dataSource = [];

  const columns = [
    {
      title: 'Claim ID',
      key: 'id',
      render: (items) => <Typography.Text>{items?.id}</Typography.Text>,
    },
    {
      title: 'Status',
      key: 'status',
      render: (items) => <SpStatusTag statusName="open" />,
    },
    {
      title: 'Submit form Claim',
      key: 'submit_form_claim',
      render: (items) => <Typography.Text>17 Oct 2024 - 10:53</Typography.Text>,
    },
    {
      title: 'Claimer Name',
      key: 'claimer_name',
      render: (items) => <Typography.Text>ธนวรรธน์ คมคาย</Typography.Text>,
    },
    {
      title: 'Claimer Tel',
      key: 'claimer_tel',
      render: (items) => <Typography.Text>0800000000</Typography.Text>,
    },
    {
      title: 'Mail',
      key: 'mail',
      render: (items) => <Typography.Text>Thanawatthon@gmail.com</Typography.Text>,
    },
    {
      title: 'Passport/ID Card Number',
      key: 'card_id',
      render: (items) => <Typography.Text>12392138183</Typography.Text>,
    },
  ];

  return <TableHeros columns={columns} dataSource={dataSource} pagination={false} />;
}
