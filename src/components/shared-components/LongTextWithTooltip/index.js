import { Tooltip } from 'antd';
import styled from '@emotion/styled';

const ShortText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`;

export default function LongTextWithTooltip({ text }) {
  return (
    <Tooltip title={text}>
      <ShortText>{text}</ShortText>
    </Tooltip>
  );
}
