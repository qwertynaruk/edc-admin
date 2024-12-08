import { Image, Skeleton } from 'antd';
import styled from '@emotion/styled';

const NoSignature = styled.div`
  width: 277px;
  height: 41px;
  background: #1b2531;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  user-select: none;
`;

const Signature = (props) => {
  const { src, loading } = props;
  if (loading) {
    return <Skeleton.Button active block />;
  }
  if (!src) return <NoSignature>ยังไม่มีลายเซ็นในระบบ</NoSignature>;
  return (
    <Image
      preview={false}
      width={188}
      height={26}
      src={src}
      fallback="data:image/png;base64,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"
    />
  );
};

export default Signature;
