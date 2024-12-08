import { Input } from 'antd';

export default function InputTextNumber(props) {
  const { value, onChange, ...rest } = props;

  const handleOnChange = (e) => {
    const { value } = e.target;
    onChange(value.toString().replace(/\D/g, ''));
  };
  return <Input {...rest} value={value} onChange={handleOnChange} />;
}
