import CustomSelect from '../CustomSelect';
import { Select } from 'antd';

const { Option } = Select;

export default function CaseStatusSelectWidget(props) {
  return (
    <CustomSelect placeholder="เลือกสถานะทางคดี" {...props}>
      <Option value="รับเลขที่อัยการแล้ว">รับเลขที่อัยการแล้ว</Option>
      <Option value="อยู่ระหว่างส่งสำนวน">อยู่ระหว่างส่งสำนวน</Option>
      <Option value="รอเลขที่อัยการ">รอเลขที่อัยการ</Option>
      <Option value="อยู่ระหว่างดำเนินการ">อยู่ระหว่างดำเนินการ</Option>
      <Option value="ไกล่เกลี่ย/ยอมความ">ไกล่เกลี่ย/ยอมความ</Option>
    </CustomSelect>
  );
}
