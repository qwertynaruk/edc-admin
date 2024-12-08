import { useState } from 'react';

import './Styles/Comment.scss';

import AddComment from './AddComment';
import ReplyContainer from './ReplyContainer';
import DeleteModal from './DeleteModal';
import CommentHeader from './CommentHeader';
import CommentFooter from './CommentFooter';

import { commentPostedTime } from '../utils';
import AttachmentFileList from 'components/shared-components/AttachmentFileList';
import _ from 'lodash';

const Comment = ({
  keyUq,
  commentData,
  updateScore,
  updateReplies,
  editComment,
  commentDelete,
  setDeleteModalState,
  canEditebled = false,
}) => {
  const { replies = [] } = commentData;
  const [replying, setReplying] = useState(false);
  const [vote, setVoted] = useState(false);
  const [score, setScore] = useState(commentData.score);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState(commentData.message);
  const [deleting, setDeleting] = useState(false);

  const addReply = (newReply) => {
    const _replies = [...commentData.replies, newReply];
    updateReplies(_replies, commentData.id);
    setReplying(false);
  };

  const updateComment = () => {
    editComment(message, commentData.id, 'comment');
    setEditing(false);
  };

  const deleteComment = (id, type) => {
    const finalType = type !== undefined ? type : 'comment';
    const finalId = id !== undefined ? id : commentData.id;
    commentDelete(finalId, finalType, commentData.id);
    setDeleting(false);
  };

  return (
    <div
      key={keyUq}
      className={`comment-container ${Array.isArray(replies) && replies.length ? 'reply-container-gap' : ''}`}
    >
      <div className="comment">
        <div className="comment--body">
          <CommentHeader
            commentData={commentData}
            setReplying={setReplying}
            setDeleting={setDeleting}
            setDeleteModalState={setDeleteModalState}
            setEditing={setEditing}
          />
          {!editing ? (
            <div>
              <div className="comment-content">{commentData.message}</div>
              <AttachmentFileList dataList={_.get(commentData, 'attachment_url', [])} enableEmpty={false} />
            </div>
          ) : (
            <textarea
              className="content-edit-box"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
          )}
          {editing && (
            <button className="update-btn" onClick={updateComment}>
              update
            </button>
          )}
        </div>
        {canEditebled && (
          <CommentFooter
            vote={vote}
            setVoted={setVoted}
            score={score}
            setScore={setScore}
            updateScore={updateScore}
            commentData={commentData}
            setReplying={setReplying}
            setDeleting={setDeleting}
            setDeleteModalState={setDeleteModalState}
            setEditing={setEditing}
          />
        )}
      </div>

      {replying && <AddComment addComments={addReply} replyingTo={commentData.email} />}
      {Array.isArray(replies) && replies.length > 0 && (
        <ReplyContainer
          key={commentData.replies.id}
          commentData={commentData.replies}
          updateScore={updateScore}
          commentPostedTime={commentPostedTime}
          addReply={addReply}
          editComment={editComment}
          deleteComment={deleteComment}
          setDeleteModalState={setDeleteModalState}
        />
      )}

      {deleting && (
        <DeleteModal
          setDeleting={setDeleting}
          deleteComment={deleteComment}
          setDeleteModalState={setDeleteModalState}
        />
      )}
    </div>
  );
};

export default Comment;
