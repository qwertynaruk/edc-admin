import { Card } from 'antd';
import { isValidElement } from 'react';
import Blocks from './Blocks';

export default function Section(props) {
  const { children, ...cardProps } = props;
  if (isValidElement(children)) {
    return <Card {...cardProps}>{children}</Card>;
  }
  return (
    <div {...cardProps}>
      <Blocks blocks={children} />
    </div>
  );
}
