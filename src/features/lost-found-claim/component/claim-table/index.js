import { Button, Image, Typography } from 'antd';

import { Link } from 'react-router-dom';
import { SpStatusTag } from 'features/shared';
import TableHeros from 'components/shared-components/TableHeros';

const dataSource = [
  {
    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/article-inline-half-caption/public/field_blog_entry_images/2021-12/img_2833_-_copy_0.jpg',
    id: 'EDC20250100001',
    type: 'Phone',
    status: 'open',
    number_of_claim: 1,
    updated_date: '17 Oct 2024 - 10:53',
  },
];

export function ClaimTable() {
  const columns = [
    {
      title: 'Image',
      key: 'img',
      render: (items, index) => (
        <div style={{ width: 35, height: 35 }}>
          <Image src={items?.img} alt={items?.name} />
        </div>
      ),
    },
    {
      title: '#REF ID',
      key: 'id',
      render: (items, index) => (
        <Link>
          <Typography.Text style={{ color: '#FF0000' }}>{items?.id}</Typography.Text>
        </Link>
      ),
    },
    {
      title: 'Item Type',
      key: 'type',
      render: (items, index) => <Typography.Text>{items?.type}</Typography.Text>,
    },
    {
      title: 'Number Of Claimants',
      key: 'number_of_claim',
      align: 'center',
      render: (items, index) => <Typography.Text>{items?.number_of_claim}</Typography.Text>,
    },
    {
      title: 'Status',
      key: 'status',
      render: (items, index) => <SpStatusTag statusName={items?.status} />,
    },
    {
      title: 'Update Time',
      key: 'updated_date',
      render: (items, index) => <Typography.Text>{items?.updated_date}</Typography.Text>,
    },
    {
      title: '',
      key: 'action',
      render: (items, index) => <Button type="primary">ดูรายละเอียด</Button>,
    },
  ];

  return <TableHeros columns={columns} dataSource={dataSource} />;
}
