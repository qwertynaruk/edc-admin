import { Tree } from 'antd';
import React from 'react';

export const NotificationUserTree = (props) => {
  const TreeForm = hocTreeForm(Tree);
  return <TreeForm {...props} />;
};

export default NotificationUserTree;

export const hocTreeForm = (Component) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    const { onChange = () => {}, value = [], defaultCheckedKeys = [], treeData, ...otherProps } = props;
    const selectParentTreeData = React.useMemo(() => {
      const clone_tree_data = [...treeData];
      const parent = clone_tree_data.map(({ key }) => key);
      return parent;
    }, [treeData]);
    React.useEffect(() => {
      if (value.length === 0) onChange([defaultCheckedKeys[0]]);
    }, [value]);
    return (
      <Component
        {...otherProps}
        defaultCheckedKeys={[...defaultCheckedKeys, ...value]}
        onCheck={(checkedKeys) => {
          const res = checkedKeys.filter((item) => !selectParentTreeData.includes(item));
          onChange(res);
        }}
        treeData={treeData}
      />
    );
  };
};
