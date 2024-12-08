import { useRef, useState } from 'react';
import { useDrag } from 'ahooks';
import _ from 'lodash';

export default function Draggable({ data, children }) {
  const dragRef = useRef(null);

  const [dragging, setDragging] = useState(false);

  useDrag(data, dragRef, {
    onDragStart: () => {
      setDragging(true);
    },
    onDragEnd: () => {
      setDragging(false);
    },
  });

  if (!_.isFunction(children)) {
    return children;
  }

  return children({ dragging, dragRef });
}
