import { Typography } from 'antd';
import _ from 'lodash';
import ReportStore from 'mobx/ReportStore';
import styled from '@emotion/styled';

const ParagraphBlock = styled(Typography.Paragraph)`
  background-color: #1b2531;
  padding: 5px;
  border-radius: 3px;
  line-height: 20px;
`;

const InvestigationList = () => {
  const { reportItems = {} } = ReportStore;
  const investigationSource = _.get(reportItems, 'investigation', {});

  return (
    <>
      <ParagraphBlock>
        <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>ส่วนราชการ :</Typography.Text>
        <Typography.Text>{_.get(investigationSource, 'header.government_sector', '-')}</Typography.Text>
      </ParagraphBlock>
      <ParagraphBlock>
        <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>โทร :</Typography.Text>
        <Typography.Text>{_.get(investigationSource, 'header.government_sector', '-')}</Typography.Text>
      </ParagraphBlock>

      <ParagraphBlock>
        <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>ที่ :</Typography.Text>
        <Typography.Text>{_.get(investigationSource, 'header.order', '-')}</Typography.Text>
      </ParagraphBlock>
      <ParagraphBlock>
        <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>วันที่ :</Typography.Text>
        <Typography.Text>{_.get(investigationSource, 'header.datetime', '-')}</Typography.Text>
      </ParagraphBlock>
      <ParagraphBlock>
        <Typography.Text style={{ opacity: 0.5, marginRight: 5 }}>เรื่อง :</Typography.Text>
        <Typography.Text>{_.get(investigationSource, 'header.topic', '-')}</Typography.Text>
      </ParagraphBlock>
    </>
  );
};

export default InvestigationList;
