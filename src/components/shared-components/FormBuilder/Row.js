import { css, cx } from '@emotion/css';
import { Row as AntRow } from 'antd';
import Blocks from './Blocks';
export default function Row(props) {
  const { children, ...rowProps } = props;
  if (!children) {
    return null;
  }
  const { className, ...rowPropsWithoutClassName } = props;
  return (
    <AntRow
      className={cx([
        className,
        css`
          display: flex;
          margin: 0 -1rem !important;
          flex-direction: row !important;
        `,
      ])}
      {...rowPropsWithoutClassName}
    >
      <Blocks blocks={children} />
    </AntRow>
  );
}
