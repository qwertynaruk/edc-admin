import { Select } from 'antd';
import CustomSelect from '../CustomSelect';

const { Option } = Select;
export default function ReportDailyStatusSelectWidget(props) {
  return (
    <CustomSelect placeholder="เลือกสถานะ" mode="multiple" allowClear {...props}>
      <Option value="ฉบับร่าง">ฉบับร่าง</Option>
      <Option value="เสร็จสิ้น">เสร็จสิ้น</Option>
    </CustomSelect>
  );
}
