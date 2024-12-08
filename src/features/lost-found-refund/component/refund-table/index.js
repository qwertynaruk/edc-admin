import { Image, Typography } from 'antd';

import { Link } from 'react-router-dom';
import { MoreOutlined } from '@ant-design/icons';
import TableHeros from 'components/shared-components/TableHeros';

const dataSource = [
  {
    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/article-inline-half-caption/public/field_blog_entry_images/2021-12/img_2833_-_copy_0.jpg',
    id: 'EDC20250100001',
    return_date: '17 Oct 2024 - 10:53',
    type: 'Phone',
    return_to: 'ธนวรรธน์ คมคาย',
    return_from: 'ร.ต.ท.จันทรรัตน์ เจริญกาณต์',
    phone: '0800000000',
  },
];

export function RefundTable() {
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
      title: 'Returned Date',
      key: 'return_date',
      render: (items, index) => <Typography.Text>{items?.return_date}</Typography.Text>,
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
      title: 'Returned to',
      key: 'return_to',
      render: (items, index) => <Typography.Text>{items?.return_to}</Typography.Text>,
    },
    {
      title: 'Phone Number',
      key: 'phone',
      render: (items, index) => <Typography.Text>{items?.phone}</Typography.Text>,
    },
    {
      title: 'Returned Name',
      key: 'return_from',
      render: (items, index) => <Typography.Text>{items?.return_from}</Typography.Text>,
    },
    {
      title: '',
      key: 'action',
      render: (items, index) => <MoreOutlined />,
    },
  ];

  return <TableHeros columns={columns} dataSource={dataSource} />;
}
