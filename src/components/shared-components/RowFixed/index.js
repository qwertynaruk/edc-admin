import { css, cx } from '@emotion/css';

import { Row } from 'antd';

const RowFixed = ({ className, ...props }) => {
  return (
    <Row
      className={cx([
        className,
        'gx-flex-row',
        css`
          margin: 0 -1rem !important;
          height: 100%;
          align-content: flex-start;
        `,
      ])}
      {...props}
    />
  );
};

export default RowFixed;
