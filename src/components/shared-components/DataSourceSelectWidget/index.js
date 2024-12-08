import CustomSelect from '../CustomSelect';
import { Select } from 'antd';

const { Option } = Select;

export default function DataSourceSelectWidget(props) {
  return (
    <CustomSelect placeholder="เลือกที่มาของข้อมูล" {...props}>
      <Option value="online">ได้รับแจ้งออนไลน์</Option>
      <Option value="flagrant">เหตุซึ่งหน้า</Option>
      <Option value="walkin">เข้ารับบริการที่สถานี</Option>
    </CustomSelect>
  );
}
