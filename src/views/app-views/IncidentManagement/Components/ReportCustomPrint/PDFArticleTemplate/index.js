import { Card } from 'antd';
import styled from '@emotion/styled';
import RenderArrestingType from './RenderArrestingType';
import RenderInvestigationType from './RenderInvestigationType';
import RenderJuvenileArrestingType from './RenderJuvenileArrestingType';

const PDFArticleTemplate = ({ reportTypeName = '', componentRef, draftColor, containerSize }) => {
  const selectRenderDetail = () => {
    const anyProps = {
      draftColor,
    };

    switch (reportTypeName) {
      case 'รายงานการจับกุม':
        return <RenderArrestingType {...anyProps} />;

      case 'รายงานการจับกุม (เยาวชน)':
        return <RenderJuvenileArrestingType {...anyProps} />;

      case 'รายงานการสืบสวน':
        return <RenderInvestigationType {...anyProps} />;

      default:
        return null;
    }
  };

  return (
    <Card
      title={reportTypeName}
      bodyStyle={{
        padding: '10px 10px 20px 10px',
        width: '100%',
        height: 500,
        overflowY: 'auto',
      }}
    >
      <div
        ref={(el) => (componentRef.current = el)}
        style={{
          backgroundColor: '#fff',
          padding: '1.25em',
          width: containerSize.width,
          minHeight: containerSize.height,
          margin: 'auto',
        }}
      >
        <ContainerCardArticle>{selectRenderDetail()}</ContainerCardArticle>
      </div>
    </Card>
  );
};

export default PDFArticleTemplate;

const ContainerCardArticle = styled.div`
  margin-top: 1rem;
`;
