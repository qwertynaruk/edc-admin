import { Select, Tag } from 'antd';
import styled from '@emotion/styled';

import './style.scss';
import { css, cx } from '@emotion/css';

export function SelectTag(props) {
  const { label, closable, onClose } = props;
  return (
    <Tag
      className={cx([
        'ant-select-selection-item',
        css`
          font-size: 14px;
          padding: 0 8px;
          span + .anticon {
            margin-left: 0;
            display: flex;
            align-items: center;
            color: #f5222d;
          }
        `,
      ])}
      closable={closable}
      onClose={onClose}
    >
      <span className="ant-select-selection-item-content">{label}</span>
    </Tag>
  );
}

const CustomSelect = styled(Select)`
  .ant-select-selection-item-remove {
    margin-top: 0 !important;
  }
`;
export default CustomSelect;
