import { Card } from 'antd';
import CommentOLF from 'components/shared-components/CommentOLF';
import _ from 'lodash';
import ReportStore from 'mobx/ReportStore';

const CommentOpinion = ({ iRef }) => {
  const { reportItems } = ReportStore;

  return (
    <Card ref={(el) => (iRef.current['แสดงความคิดเห็น'] = el)}>
      <div className="gx-mt-4">
        <CommentOLF
          dataSource={_.get(reportItems, 'comments', [])}
          onSubmitComment={(ss) => ReportStore.sendComment(ss, reportItems)}
        />
      </div>
    </Card>
  );
};

export default CommentOpinion;
