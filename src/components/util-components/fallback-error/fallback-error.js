import { css } from '@emotion/css';
import { Card, Result } from 'antd';

export const FallbackError = ({ isError = true, isFullHeight = false, children, borderLess = false, style, error }) => {
  if (!isError && children) {
    return <>{children}</>;
  }

  return (
    <Card
      style={style}
      className={css`
        height: ${isFullHeight ? 'calc(100vh - 220px)' : '350px'};

        border: ${borderLess ? 'none' : '1px solid #e8e8e8'};

        .ant-result {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          color: #fff;

          .ant-result-title,
          .ant-result-subtitle {
            color: #fff;
          }
        }
      `}
    >
      <Result
        status="error"
        title={error?.title ?? 'Whoops, Something went wrong'}
        subTitle={error?.description ?? 'There was a problem processing the request. please try again later.'}
      />
    </Card>
  );
};
