import { EditOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useState } from 'react';

export const EditterHover = (props) => {
  const { children, tag = 'div', icon = EditOutlined, propsdetail, position, onClick } = props;
  const [hoverEdit, setHoverEdit] = useState();
  const Container = styled(tag)`
    position: relative;
    ${position ? 'padding:1rem 1.5rem' : ''}
  `;
  const Icon = styled(icon)`
    ${({ styleicon }) => styleicon}
  `;

  return (
    <Container {...propsdetail} onMouseEnter={() => setHoverEdit(true)} onMouseLeave={() => setHoverEdit(false)}>
      {children}
      {hoverEdit && !position && <Icon className="cursor-pointer pl-2" onClick={onClick} id="edit-content-helmet" />}
      {hoverEdit && position === 'topleft' && (
        <Icon
          className="cursor-pointer gx-p-2 gx-position-absolute"
          styleicon={' top:0;left:0;'}
          onClick={onClick}
          id="edit-content-helmet"
        />
      )}
      {hoverEdit && position === 'topright' && (
        <Icon
          className="cursor-pointer gx-p-2 gx-position-absolute"
          styleicon={' top:0;right:0;'}
          onClick={onClick}
          id="edit-content-helmet"
        />
      )}
      {hoverEdit && position === 'bottomleft' && (
        <Icon
          className="cursor-pointer gx-pl-2 gx-position-absolute"
          styleicon={' bottom:0;left:0;'}
          onClick={onClick}
          id="edit-content-helmet"
        />
      )}
      {hoverEdit && position === 'bottomright' && (
        <Icon
          className="cursor-pointer gx-pl-2 gx-position-absolute"
          styleicon={' bottom:0;right:0;'}
          onClick={onClick}
          id="edit-content-helmet"
        />
      )}
    </Container>
  );
};
