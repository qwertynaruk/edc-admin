import _ from 'lodash';

export function findChildData(data, key) {
  for (const item of data) {
    if (item.key === key) {
      return item;
    }
    if (item.children) {
      const found = findChildData(item.children, key);
      if (found) return found;
    }
  }
  return null;
}

export function findAndPushDataToChildren(data, key, level, newData) {
  const oldData = Object.assign([], data);
  for (const item of oldData) {
    if (item.key === key && item.level === level) {
      item.children = newData[0].children;
      return true;
    }
    if (item.children) {
      const found = findAndPushDataToChildren(item.children, key, level, newData);
      if (found) return true;
    }
  }
  return false;
}
export function mapOrgTreeToOneLevle(data = null, optionField = false) {
  const dataSource = !_.isEmpty(data) ? data : [];
  const tempArrayData = [];
  if (dataSource?.full_name_th && dataSource?._id && !tempArrayData.includes(dataSource?._id)) {
    tempArrayData.push({
      [optionField ? 'label' : 'full_name_th']: dataSource?.full_name_th,
      [optionField ? 'value' : 'id']: dataSource?._id,
    });
  }

  const mapDataChildren = (dataSourceChildren = []) => {
    dataSourceChildren.forEach((dataChild) => {
      if (!tempArrayData.includes(dataSource?._id)) {
        tempArrayData.push({
          [optionField ? 'label' : 'full_name_th']: dataChild?.full_name_th,
          [optionField ? 'value' : 'id']: dataChild?._id,
        });
      }
      if (!_.isEmpty(dataChild?.children)) {
        mapDataChildren(dataChild?.children);
      }
    });
  };
  mapDataChildren(dataSource?.children);
  return tempArrayData;
}
