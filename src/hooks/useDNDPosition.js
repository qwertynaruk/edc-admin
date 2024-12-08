import { v4 as uuid } from 'uuid';
export const useDNDPosition = () => {
  const reorder = (list, startIndex, endIndex) => {
    const removed = list.component.splice(startIndex, 1);
    list.component.splice(endIndex, 0, ...removed);
  };
  const reorderSection = (list, startIndex, endIndex) => {
    const data = Array.from(list);
    const removed = data.splice(startIndex, 1);
    data.splice(endIndex, 0, ...removed);
    return data;
  };

  const append = (source, destination, droppableSource, elementType, appendType, masterElement) => {
    const item = source[droppableSource];
    const parentSource = masterElement[droppableSource];

    if (appendType === 'single') {
      destination.push({
        ...item,
        key: getKeyId() + droppableSource,
        ...(elementType ? { element_type: elementType } : {}),
        master_element: {
          id: parentSource.id,
        },
      });
    }

    if (appendType === 'group') {
      item.component.forEach((el, _index) => {
        destination.push({
          ...el,
          key: (parseInt(getKeyId() + droppableSource) + (_index ^ 2)).toString(),
          ...(elementType ? { element_type: elementType } : {}),
          master_element: {
            id: parentSource.id,
          },
        });
      });
    }
  };

  const copy = (source, destination, droppableSource, droppableDestination, elementType = {}) => {
    const item = source[droppableSource];
    destination.splice(droppableDestination.index, 0, {
      ...item,
      key: getKeyId(),
      ...(elementType && { element_type: elementType }),
    });
  };

  const extraCopy = (optionProps) => {
    const { source, destination, droppableSource, droppableDestination, elementType, copyType, masterElement } =
      optionProps;
    const item = source[droppableSource];

    if (copyType === 'single') {
      destination.splice(droppableDestination.index, 0, {
        ...item,
        key: getKeyId(),
        ...(elementType ? { element_type: elementType } : {}),
        master_element: {
          id: masterElement[droppableSource].id,
        },
      });
    }

    if (copyType === 'group') {
      item.component.forEach((el, _index) => {
        destination.splice(droppableDestination.index, 0, {
          ...el,
          key: (parseInt(getKeyId()) + (_index ^ 2)).toString(),
          ...(elementType ? { element_type: elementType } : {}),
          master_element: {
            id: masterElement[droppableSource].id,
          },
        });
      });
    }
  };

  const copyToSection = (activeKey, datadestination, source, destination, droppableSource, droppableDestination) => {
    const data = Array.from(datadestination);
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const item = sourceClone[droppableSource];
    destClone.splice(droppableDestination.index, 0, {
      section_name: uuid(),
      children: [
        {
          ...item,
          key: getKeyId(),
        },
      ],
    });
    return destClone;
  };
  const copyMove = (source, destination, droppableSource, droppableDestination) => {
    const removed = source.splice(droppableSource.index, 1);

    destination.splice(droppableDestination.index, 0, ...removed);
  };

  const move = (source, destination, droppableSource, droppableDestination) => {
    const removed = source.splice(droppableSource.index, 1);

    destination.splice(droppableDestination.index, 0, ...removed);
  };

  const getKeyId = () => {
    let keytext = '';
    keytext = Math.floor(Date.now() / 1000);
    return keytext.toString();
  };

  return {
    reorder,
    copy,
    move,
    getKeyId,
    copyMove,
    copyToSection,
    reorderSection,
    extraCopy,
    append,
  };
};
