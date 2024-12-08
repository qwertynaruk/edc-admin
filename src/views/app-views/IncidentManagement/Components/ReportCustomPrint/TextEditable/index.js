import { Typography } from 'antd';
import { useState } from 'react';

const TextEditable = ({ children = '', paddingLeft = true, defaultValue = '-' }) => {
  const [editableStr, setEditableStr] = useState(children);
  return (
    <Typography.Text
      className={`editeble ${paddingLeft && 'gx-ml-1'} gx-mr-1`}
      editable={{ triggerType: 'text', onChange: setEditableStr }}
    >
      {editableStr || defaultValue}
    </Typography.Text>
  );
};

export default TextEditable;
