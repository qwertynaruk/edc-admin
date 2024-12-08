import _ from 'lodash';
import OrganizationTreeTitle from './OrganizationTreeTitle';

export function mapRawToTitle(raw) {
  if (!raw) return {};
  if (!raw.personnel_info) return {};
  return {
    ...raw.personnel_info[0],
    direct_subordinate_count: raw.direct_subordinate_count,
    indirect_subordinate_count: raw.indirect_subordinate_count,
    total_subordinate_count: raw.total_subordinate_count,
  };
}
export function fillDirectSubordinates(raw) {
  if (!raw) return [];

  function rescursive(item) {
    const child = raw.find((r) => r._id === item._id);
    if (!child) {
      return item;
    }
    if (child.direct_subordinates.length > 0) {
      child.direct_subordinates = child.direct_subordinates.map((ds) => {
        return rescursive(ds);
      });
    }
    return child;
  }
  return raw.map((item) => {
    return {
      ...item,
      direct_subordinates: item.direct_subordinates.map(rescursive),
    };
  });
}
export function transform(raw) {
  if (!raw) {
    return [];
  }

  const self = new Map();

  self.set('title', { ...raw.self });
  self.set('key', raw.self._id);

  if (Array.isArray(raw.children)) {
    if (raw.children.length > 0) {
      self.set(
        'children',
        raw.children.map((child) => ({ title: child, key: child._id }))
      );
    }
  }

  const selfItem = Object.fromEntries(self);

  if (!Array.isArray(raw.managers)) {
    return [selfItem];
  }

  if (raw.managers.length < 1) {
    return [selfItem];
  }

  const result = [];

  raw.managers.forEach((manager) => {
    result.push({
      title: { ...manager },
      key: manager._id,
    });
  });

  result[result.length - 1].children = [selfItem];

  return result;
}

export function toTreeData(data, current = {}, props) {
  const defaultCurrent = [
    {
      title: <OrganizationTreeTitle person={current} active {...props} />,
      isLeaf: false,
      key: current._id,
    },
  ];
  if (!data) {
    return defaultCurrent;
  }
  if (_.isEmpty(data)) {
    return defaultCurrent;
  }
  const transformedData = transform(data);
  if (transformedData.length === 0) {
    return defaultCurrent;
  }
  function recursive(children) {
    if (!children) return;
    return children.map((child) => {
      const isCurrent = child.title._id === current?._id;

      const person = isCurrent ? { ...child.title, ...current } : child.title;
      return {
        key: child.key,
        title: <OrganizationTreeTitle person={person} active={isCurrent} {...props} />,
        children: recursive(child.children),
      };
    });
  }
  return transformedData.map((item) => {
    const isCurrent = item.title._id === current?._id;
    return {
      key: item.key,
      title: (
        <OrganizationTreeTitle
          person={isCurrent ? { ...item.title, ...current } : item.title}
          active={isCurrent}
          {...props}
        />
      ),
      isLeaf: false,
      children: recursive(item.children),
    };
  });
}
