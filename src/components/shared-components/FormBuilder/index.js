import { Form } from 'antd';
import { useState } from 'react';
import Block from './Block';
import Droppable from './Droppable';

export default function FormBuilder(props) {
  const [structure, setStructure] = useState(props.structure || []);

  const onDom = (index) => {
    return (block) => {
      console.log(index, block);
      // const newStructure = [...structure];
      // newStructure.splice(index + 1, 0, block);
      // setStructure(newStructure);
    };
  };

  const onDelete = (index) => {
    return (object) => {
      const newStructure = [...structure];
      newStructure.splice(index, 1);
      setStructure(newStructure);
    };
  };

  const blockProps = (item, index) => {
    return {
      onDelete: onDelete(index),
      onDom: onDom(index),
      ...item,
    };
  };

  return (
    <Form layout="vertical">
      {structure.map((item, index) => (
        <Droppable key={item.key || index}>
          {/* // <Block key={item.key || index} onDelete={onDelete(index)} onDom={onDom(index)} {...item} /> */}
          <Block {...blockProps(item, index)} />
        </Droppable>
      ))}
    </Form>
  );
}
