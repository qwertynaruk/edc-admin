import 'dayjs/locale/th';

import { Avatar, Typography } from 'antd';
import { CommentOutlined, UserOutlined } from '@ant-design/icons';

import { EventsDetailAttachmentsList } from '../../incident-management-events-detail/components/events-detail-attachments-list';
import Flex from 'components/shared-components/Flex';
import { css } from '@emotion/css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('th');

export const CommentList = ({ comments = [] }) => {
  const commentsLength = comments?.length ?? 0;

  return (
    <div className={css``}>
      <Flex alignItems="center" className="gx-mb-4">
        <CommentOutlined
          style={{
            fontSize: '18px',
            marginRight: '10px',
          }}
        />
        <Typography.Title level={5} className="gx-mb-0">
          แสดงความคิดเห็น ({commentsLength})
        </Typography.Title>
      </Flex>
      {comments?.map((comment, index) => (
        <div
          key={index}
          className={css`
            margin-bottom: 16px;
          `}
        >
          <div
            className={css`
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 10px;
            `}
          >
            <Avatar style={{ width: 32, minWidth: 32, background: '#1b2531' }} icon={<UserOutlined />} />
            <Typography.Text className="gx-ml-2">
              {`${comment.prefix_name}${comment.first_name} ${comment.last_name}`}
            </Typography.Text>
            <Typography.Text className="gx-ml-2">
              {dayjs(comment?.created_at).format('DD MMMM YYYY HH:mm')}
            </Typography.Text>
          </div>
          <div
            className={css`
              background-color: #1b2531;
              padding: 16px;
              border-radius: 8px;
              margin-left: 42px;
              overflow: auto;
            `}
          >
            {comment.message && <Typography.Text>{comment.message}</Typography.Text>}
            {/* <CommentFileAttachmentsList attachmentsUrl={comment.attachment_url} /> */}
            <EventsDetailAttachmentsList attachments={comment.attachment_url} />
          </div>
        </div>
      ))}
    </div>
  );
};
