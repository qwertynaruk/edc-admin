import { Avatar, Image, Space } from 'antd';

import CommentBtn from './CommentBtn';
import _ from 'lodash';
import { columnDateRender } from 'components/shared-components/CustomTable/useTableColumnRender';

const CommentHeader = ({ commentData, setReplying, setDeleting, setDeleteModalState, setEditing }) => {
  return (
    <div className="comment--header">
      <Space direction="horizontal">
        <div className="profile-pic">
          <Avatar size={38} icon={<Image src="" fallback="https://app.udoncop.com/img/thumb-avatar/personel.png" />} />
        </div>
        <Space direction="vertical">
          <div className="username">
            {_.get(
              commentData,
              'email',
              [
                _.get(commentData, 'prefix_name', ''),
                _.get(commentData, 'first_name', ''),
                _.get(commentData, 'last_name', ''),
              ].join(' ')
            )}
          </div>
          <div className="comment-posted-time">
            {columnDateRender(_.get(commentData, 'created_at'), 'short-month-full')}
          </div>
        </Space>
      </Space>
      <CommentBtn
        commentData={commentData}
        setReplying={setReplying}
        setDeleting={setDeleting}
        setDeleteModalState={setDeleteModalState}
        setEditing={setEditing}
      />
    </div>
  );
};

export default CommentHeader;
