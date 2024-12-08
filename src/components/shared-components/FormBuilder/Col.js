import { Col as AntCol } from 'antd';
import { isValidElement } from 'react';
import Blocks from './Blocks';
export default function Col(props) {
  const { children, ...colProps } = props;
  if (!children) {
    return null;
  }

  if (isValidElement(children)) {
    return <AntCol {...colProps}>{children}</AntCol>;
  }

  return (
    <AntCol {...colProps}>
      <Blocks blocks={children} />
    </AntCol>
  );
}
