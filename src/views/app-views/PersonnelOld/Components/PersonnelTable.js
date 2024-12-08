import { IdcardOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import CustomTable from 'components/shared-components/CustomTable';
import { renderPersonnelName, renderPosition } from 'utils/stringRender';

const COLUMNS = [
  {
    title: 'รูปภาพ',
    dataIndex: 'cover_image_file',
    render: (text) => {
      return (
        <Avatar src={text}>
          <IdcardOutlined />
        </Avatar>
      );
    },
  },
  {
    title: 'ยศ ชื่อ สกุล',
    dataIndex: 'name',
    render: (_, record) => renderPersonnelName(record),
  },
  {
    title: 'ฝ่ายงาน',
    dataIndex: 'main_agency',
    render: (text) => text || '-',
  },
  {
    title: 'ตำแหน่ง',
    dataIndex: 'position',
    render: (_, personnel) => renderPosition(personnel),
  },
  {
    title: 'นามเรียกขาน',
    dataIndex: 'middle_name',
    render: (text) => text || '-',
  },
  {
    title: 'เบอร์โทร',
    dataIndex: 'phone_number',
    render: (text) => text || '-',
  },
];
export default function PersonnelTable(props) {
  return <CustomTable columns={COLUMNS} pagination={false} {...props} />;
}
