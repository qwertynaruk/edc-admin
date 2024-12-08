import { TreeSelect } from 'antd';
import styled from '@emotion/styled';

const { TreeNode } = TreeSelect;

export const CustomTreeSelect = styled(TreeSelect)`
  .ant-select-selection-item-remove {
    margin-top: 0 !important;
  }
  &.ant-select-disabled {
    .ant-select-selector {
      background-color: rgba(0, 0, 0, 0.25) !important;
    }
  }
`;

export const CustomTreeNode = styled(TreeNode)`
  background-color: red !important;
`;

export default CustomTreeSelect;
