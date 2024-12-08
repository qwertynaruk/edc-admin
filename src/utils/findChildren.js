export const findTitleByText = (data, text, allData = false) => {
  const foundTitle = [];
  function recursiveSearch(items) {
    for (const item of items) {
      if (item?.title && item?.title.search(text) > -1) {
        if (allData) {
          foundTitle.push(item);
        } else {
          foundTitle.push(item.key);
        }
      }
      if (item?.children) {
        recursiveSearch(item.children);
      }
    }
  }
  recursiveSearch(data);
  return foundTitle;
};

export const findTitleByKey = (data, key) => {
  let findData = null;
  function recursiveSearch(items) {
    for (const item of items) {
      if (item?.key && item?.key === key) {
        findData = item;
      }
      if (item?.children) {
        recursiveSearch(item.children);
      }
    }
  }
  recursiveSearch(data);
  return findData;
};
