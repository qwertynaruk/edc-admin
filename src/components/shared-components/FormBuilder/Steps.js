import { useState } from 'react';
import { Steps as AntSteps } from 'antd';

import Blocks from './Blocks';
import { css } from '@emotion/css';

export default function Steps({ children, ...stepsProps }) {
  const [current, setCurrent] = useState(0);

  if (!children) {
    return null;
  }
  if (!Array.isArray(children)) {
    return null;
  }
  const items = children.filter((child) => child.type === 'Step');

  const changeStep = (index) => {
    return () => {
      setCurrent(index);
    };
  };

  return (
    <>
      <AntSteps current={current} {...stepsProps}>
        {items.map((item, index) => (
          <AntSteps.Step key={item.id || index} onClick={changeStep(index)} {...item} />
        ))}
      </AntSteps>
      <div
        className={css`
          margin: 1rem 0;
        `}
      >
        {items.length > 0 ? <Blocks blocks={items[current].children} /> : null}
      </div>
    </>
  );
}
