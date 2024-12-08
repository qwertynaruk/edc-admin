import { Checkbox } from 'antd';
import DatePicker from '../DatePicker';
import Blocks from './Blocks';
import Col from './Col';
import EditableBlock from './EditableBlock';
import FormItem from './FormItem';
import Html from './Html';
import Row from './Row';
import Section from './Section';
import Steps from './Steps';
// export const types = {
//   Html: 'HTML',
//   Col: 'Col',
//   'Form.Item': 'Item',
//   Section: '',
//   Steps: '',
//   Row: '',
//   DatePicker: '',
//   Checkbox: '',
// };

export default function Block(props) {
  const { type, onDelete, ...componentProps } = props;

  const deleteItem = () => {
    onDelete(props);
  };

  const editableBlockProps = {
    onDelete: deleteItem,
    type,
    onDom: (data) => {
      // componentProps.onDom(data);
      console.log(props);
    },
  };

  let component = null;

  switch (type) {
    case 'Col': {
      const { children, ...colProps } = componentProps;
      return (
        <Col {...colProps}>
          <EditableBlock {...editableBlockProps}>
            <Blocks blocks={children} />
          </EditableBlock>
        </Col>
      );
    }
    case 'Form.Item': {
      const { label, ...formItemProps } = componentProps;
      // const { children } = formItemProps;
      // const { type } = children;

      // const valuePropName = type === 'Checkbox' ? 'checked' : 'value';
      return (
        <EditableBlock title={label} {...editableBlockProps}>
          <FormItem {...formItemProps} />
        </EditableBlock>
      );
    }
    case 'Html': {
      const { value } = props;
      component = <Html value={value} />;
      break;
    }
    case 'Section':
      component = <Section {...componentProps} />;
      break;
    case 'Steps':
      component = <Steps {...componentProps} />;
      break;
    case 'Row':
      component = <Row {...componentProps} />;
      break;
    case 'DatePicker':
      component = <DatePicker {...componentProps} />;
      break;
    case 'Checkbox':
      component = <Checkbox {...componentProps} />;
      break;
    default:
      component = null;
      break;
  }
  if (!component) {
    return null;
  }
  return <EditableBlock {...editableBlockProps}>{component}</EditableBlock>;
}
