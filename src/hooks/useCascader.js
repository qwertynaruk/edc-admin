const useCascader = () => {
  const createCasceder = (dataList = {}, label = '', value = '', children = []) => {
    const cloneData = { ...dataList };
    const childrenData = cloneData[children] || [];
    if (childrenData.length > 0) {
      return {
        value: cloneData[value],
        label: cloneData[label] ? cloneData[label] : cloneData[value],
        children: childrenData.map((item) => {
          return createCasceder(item, label, value, children);
        }),
        // children: cloneData[children].map((item) => createCasceder(item, label, value, children)),
      };
    }
    return { value: cloneData[label], label: cloneData[value] };
  };
  return { createCasceder };
};

export default useCascader;
