import { Form } from 'antd';
import Blocks from './Blocks';

export default function FormItem(props) {
  const { children, ...formItemProps } = props;
  if (!children) {
    return null;
  }
  return (
    <Form.Item {...formItemProps}>
      <Blocks blocks={children} />
    </Form.Item>
  );
}
