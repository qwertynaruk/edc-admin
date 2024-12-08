import { Image, Typography } from 'antd';

import { Link } from 'react-router-dom';
import { MoreOutlined } from '@ant-design/icons';
import { SpStatusTag } from 'features/shared';
import TableHeros from 'components/shared-components/TableHeros';

const dataSource = [
  {
    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/article-inline-half-caption/public/field_blog_entry_images/2021-12/img_2833_-_copy_0.jpg',
    id: 'EDC20250100001',
    report_date: '17 Oct 2024 - 10:53',
    status: 'open',
    type: 'Phone',
    brand: 'Apple',
    model: 'Iphone 20 pro',
    color: 'สีดำ',
    name: 'ธนวรรธน์ คมคาย',
    email: 'Thanawatthon@gmail.com',
    phone: '0800000000',
  },
];

export function LostReportTable() {
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
      title: '#Missing ID',
      key: 'id',
      render: (items, index) => (
        <Link>
          <Typography.Text style={{ color: '#FF0000' }}>{items?.id}</Typography.Text>
        </Link>
      ),
    },
    {
      title: 'Reported Date',
      key: 'report_date',
      render: (items, index) => <Typography.Text>{items?.report_date}</Typography.Text>,
    },
    {
      title: 'Status',
      key: 'status',
      render: (items, index) => <SpStatusTag statusName={items?.status} />,
    },
    {
      title: 'Item Type',
      key: 'type',
      render: (items, index) => <Typography.Text>{items?.type}</Typography.Text>,
    },
    {
      title: 'Brand',
      key: 'brand',
      render: (items, index) => <Typography.Text>{items?.brand}</Typography.Text>,
    },
    {
      title: 'Model',
      key: 'model',
      render: (items, index) => <Typography.Text>{items?.model}</Typography.Text>,
    },
    {
      title: 'Color',
      key: 'color',
      render: (items, index) => <Typography.Text>{items?.color}</Typography.Text>,
    },
    {
      title: 'Name',
      key: 'name',
      render: (items, index) => <Typography.Text>{items?.name}</Typography.Text>,
    },
    {
      title: 'Contact Email',
      key: 'email',
      render: (items, index) => <Typography.Text>{items?.email}</Typography.Text>,
    },
    {
      title: 'Phone Number',
      key: 'phone',
      render: (items, index) => <Typography.Text>{items?.phone}</Typography.Text>,
    },
    {
      title: '',
      key: 'action',
      render: (items, index) => <MoreOutlined />,
    },
  ];

  return <TableHeros columns={columns} dataSource={dataSource} />;
}
