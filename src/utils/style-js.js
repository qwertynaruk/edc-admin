import { Collapse } from 'antd';
import styled from '@emotion/styled';

export const SuffixCheckbox = styled.div`
  position: absolute;
  right: 0;
  z-index: 11;
  ${(props) => props.style}

  > label {
    font-size: 8px !important;

    > .ant-checkbox {
      > .ant-checkbox-inner {
        width: 15px;
        height: 15px;

        &::after {
          width: 4px;
          height: 7px;
          top: 5px;
          left: 3px;
        }
      }
    }
  }
  div.ant-form-item-control-input {
    min-height: fit-content;
  }
`;

export const CustomCollapse = styled(Collapse)`
  background: transparent !important;
  border: none !important;
  .ant-collapse-header {
    background-color: ${({ nested }) => (nested ? 'rgba(27, 37, 49, 0.4)' : '#1B2531')};
    border-radius: 0 !important;
    > div {
      display: inline-block;
    }
  }
  .ant-collapse-content {
    border: none;
    background: transparent !important;
    &.ant-collapse-content-active {
      border: none;
    }
  }
  .ant-collapse-content-box {
    background-color: rgba(55, 66, 86, 0.4);
  }
  > .ant-collapse-item {
    border: none !important;
  }
`;
