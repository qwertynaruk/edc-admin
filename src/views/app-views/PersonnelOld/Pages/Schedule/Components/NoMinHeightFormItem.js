import { Form } from 'antd';
import styled from '@emotion/styled';

const NoMinHeightFormItem = styled(Form.Item)`
  .ant-form-item-control-input {
    min-height: initial;
  }
`;

export default NoMinHeightFormItem;
