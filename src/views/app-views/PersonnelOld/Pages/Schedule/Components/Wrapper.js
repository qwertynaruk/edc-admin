import { Space } from 'antd';
import styled from '@emotion/styled';

export const ShiftWrapper = styled(Space)`
  > .ant-space-item:first-child {
    width: 32px;
  }
  > .ant-space-item:last-child {
    flex: 1;
  }
`;

export const StartStopWrapper = styled(Space)`
  > .ant-space-item:first-child {
    flex: 1;
  }
  > .ant-space-item:last-child {
    flex: 1;
  }
`;
