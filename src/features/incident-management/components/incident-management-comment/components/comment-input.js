import { Avatar, Input, Upload } from 'antd';
import { COMMENT_TYPE, COMMENT_TYPE_POLICE } from 'constants/CommentConstant';
import { PaperClipOutlined, SendOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons';

import { BUCKETNAME_SOS } from 'constants/SOSConstant';
import { EventsDetailAttachmentsList } from '../../incident-management-events-detail/components/events-detail-attachments-list';
import UserStore from 'mobx/UserStore';
import { css } from '@emotion/css';
import dayjs from 'dayjs';
import { useCommentIncidentManagementV2 } from '../../../api/comment-incident-management';
import { useState } from 'react';
import { useUploadFileManagementPrivate } from '../../../../shared';

export const CommentInput = ({ incidentId, onCommentTrigger, data, isLoading }) => {
  const [comment, setComment] = useState('');
  const [attachmentsUrl, setAttachmentsUrl] = useState([]);

  const uploadFileManagementPublic = useUploadFileManagementPrivate({
    module: BUCKETNAME_SOS[1]?.comment?.module,
    group: BUCKETNAME_SOS[1]?.comment?.group,
    onSuccess: (data) => {
      if (data?.body?.file_name) {
        setAttachmentsUrl((prev) => [...prev, data?.body?.key]);
      }
    },
  });

  // const commentIncidentManagement = useCommentIncidentManagement({
  const commentIncidentManagement = useCommentIncidentManagementV2({
    incidentId,
    onSuccess: () => {
      setComment('');
      setAttachmentsUrl([]);
      onCommentTrigger?.();
    },
  });

  const onComment = () => {
    if (!comment && attachmentsUrl.length === 0) return;

    const payload = {
      update_type: COMMENT_TYPE.add.type,
      comment: {
        comment_type: COMMENT_TYPE_POLICE,
        organization: UserStore?.organization?.organization,
        auth_id: UserStore?.user?._id,
        first_name: UserStore?.user?.first_name,
        last_name: UserStore?.user?.last_name,
        prefix_name: UserStore?.user?.prefix_name,
        message: comment,
        created_at: dayjs().toISOString(),
        attachment_url: attachmentsUrl,
      },
    };

    commentIncidentManagement.submit(payload);
  };

  const checkUploadFile = (file) => {
    // const isJpgOrPng = ALL_FILE_EXTENSIONS_VALIDATE.includes(file.type);

    // // if (!isJpgOrPng) {
    // //   notification.error({
    // //     message: 'ประเภทไฟล์ต้องเป็น' + ALL_FILE_EXTENSIONS,
    // //   });
    // // }

    // const isLt2M = file.size / 1024 / 1024 < 5;
    // if (!isLt2M) {
    //   notification.error({
    //     message: 'ขนาดไฟล์เกิน ขนาดไฟล์ต้องไม่เกิน 5MB',
    //   });
    // }
    // // if (isJpgOrPng && isLt2M) {
    // if (isLt2M) {
    //   uploadFileManagementPublic.submit({ file });
    // }
    // return false;

    return true;
  };

  return (
    <>
      <div
        className={css`
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;

          .anticon {
            font-size: 20px;
          }
        `}
      >
        <Avatar style={{ width: 32, minWidth: 32, background: '#1b2531' }} icon={<UserOutlined />} />
        <Input
          value={comment}
          // addonAfter={(isLoading || commentIncidentManagement.isLoading) && <SyncOutlined spin />}
          onChange={(e) => setComment(e.target.value)}
          placeholder="เขียนความคิดเห็น..."
          status="error"
          disabled={isLoading || commentIncidentManagement.isLoading}
          onPressEnter={onComment}
        />

        {commentIncidentManagement.isLoading ? (
          <SyncOutlined spin />
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                gap: '10px',
              }}
            >
              {/* <Upload beforeUpload={checkUploadFile} showUploadList={false} accept={ALL_FILE_EXTENSIONS}> */}
              <Upload beforeUpload={checkUploadFile} showUploadList={false}>
                <PaperClipOutlined
                  style={{
                    cursor: 'pointer',
                  }}
                />
              </Upload>
              <SendOutlined onClick={onComment} disabled={commentIncidentManagement.isLoading} />
            </div>
          </>
        )}
      </div>
      {/* <CommentFileAttachmentsList attachmentsUrl={attachmentsUrl} /> */}
      <EventsDetailAttachmentsList attachments={attachmentsUrl} />
    </>
  );
};
