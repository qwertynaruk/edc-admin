import styled from '@emotion/styled';

const SideMenuItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const SideMenuItem = ({ left, right, ...props }) => {
  return (
    <SideMenuItemWrapper {...props}>
      <div>{left}</div>
      <div>{right}</div>
    </SideMenuItemWrapper>
  );
};

export default SideMenuItem;
