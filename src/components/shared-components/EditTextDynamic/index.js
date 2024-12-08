import styled from '@emotion/styled';

const EditTextDynamic = (props) => {
  const { __html, position } = props;
  const Container = styled('div')`
    display: flex;
    text-align: ${position};
    flex-direction: column;
  
}
  `;
  return <Container dangerouslySetInnerHTML={{ __html }} />;
};

export default EditTextDynamic;
