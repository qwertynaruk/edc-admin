import { Select } from 'antd';

const { Option } = Select;
const YesOrNoSelect = (props) => {
  return (
    <Select placeholder="ใช่หรือไม่" {...props}>
      <Option value={true}>ใช่</Option>
      <Option value={false}>ไม่</Option>
    </Select>
  );
};
export default YesOrNoSelect;
