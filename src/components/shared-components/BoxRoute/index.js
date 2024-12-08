import styled from '@emotion/styled';

const BoxRoute = styled.div`
  background: #1b2531;
  border: 1px dashed;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 1.5em 5px;
  cursor: pointer;
  transition: 0.5s all ease;

  &:hover {
    opacity: 0.6;
  }

  > .ant-typography {
    margin-top: 2em;
  }
`;
export default BoxRoute;
