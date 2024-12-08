import { Select } from 'antd';

const { Option } = Select;

export default function ProceedingsTypeSelectWidget(props) {
  return (
    <Select placeholder="เลือกประเภทการดำเนินคดี" {...props}>
      <Option value="ตกลงกันได้">ตกลงกันได้</Option>
      <Option value="ดำเนินคดีเปรียบเทียบปรับ">ดำเนินคดีเปรียบเทียบปรับ</Option>
      <Option value="ดำเนินคดี">ดำเนินคดี</Option>
      <Option value="รอข้อมูลเพิ่มเติม">รอข้อมูลเพิ่มเติม</Option>
    </Select>
  );
}
