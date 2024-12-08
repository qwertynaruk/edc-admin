import CustomSelect from '../CustomSelect';
import { Select } from 'antd';

const { Option } = Select;

export default function IncidenceAnnounceStatusSelectWidget(props) {
  return (
    <CustomSelect placeholder="เลือกสถานะ" {...props}>
      <Option value="รอดำเนินการ">รอดำเนินการ</Option>
      <Option value="กำลังดำเนินการ">กำลังดำเนินการ</Option>
      <Option value="เสร็จสิ้น">เสร็จสิ้น</Option>
      <Option value="ยกเลิก">ยกเลิก</Option>
    </CustomSelect>
  );
}
