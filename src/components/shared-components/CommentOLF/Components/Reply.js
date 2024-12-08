import { useEffect, useState } from 'react';

import './Styles/Comment.scss';

import AddComment from './AddComment';
import DeleteModal from './DeleteModal';
import CommentHeader from './CommentHeader';
import CommentFooter from './CommentFooter';

const Reply = ({
  commentData,
  commentPostedTime,
  updateScore,
  addNewReply,
  editComment,
  deleteComment,
  setDeleteModalState,
}) => {
  const { replies = [] } = commentData;
  const [replying, setReplying] = useState(false);
  const [time, setTime] = useState('');
  const [vote, setVoted] = useState(false);
  const [score, setScore] = useState(commentData.score);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState(commentData.message);
  const [deleting, setDeleting] = useState(false);

  // get time from comment posted
  const createdAt = new Date(commentData.created_at);
  const today = new Date();
  const differenceInTime = today.getTime() - createdAt.getTime();

  useEffect(() => {
    setTime(commentPostedTime(differenceInTime));
  }, [differenceInTime, commentPostedTime, vote]);

  // adding reply
  const addReply = (newReply) => {
    addNewReply(newReply);
    setReplying(false);
  };

  const commentContent = () => {
    const text = commentData.message.trim().split(' ');
    const firstWord = text.shift().split(',');

    return !editing ? (
      <div className="comment-content">
        <span className="replyingTo">{firstWord}</span>
        {text.join(' ')}
      </div>
    ) : (
      <textarea
        className="content-edit-box"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
    );
  };

  const updateComment = () => {
    editComment(message, commentData.id, 'reply');
    setEditing(false);
  };

  // delete comment
  const deleteReply = () => {
    deleteComment(commentData.id, 'reply');
    setDeleting(false);
  };

  return (
    <div className={`comment-container ${Array.isArray(replies) && replies.length > 0 ? 'gap' : ''}`}>
      <div className="comment">
        <div className="comment--body">
          <CommentHeader
            commentData={commentData}
            setReplying={setReplying}
            setDeleting={setDeleting}
            setDeleteModalState={setDeleteModalState}
            setEditing={setEditing}
            time={time}
          />

          {commentContent()}
          {editing && (
            <button className="update-btn" onClick={updateComment}>
              update
            </button>
          )}
        </div>
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
      </div>

      {replying && <AddComment addComments={addReply} replyingTo={commentData.email} />}
      {replies.map((reply) => (
        <Reply key={reply.id} commentData={reply} commentPostedTime={commentPostedTime} addReply={addReply} />
      ))}

      {deleting && (
        <DeleteModal setDeleting={setDeleting} deleteComment={deleteReply} setDeleteModalState={setDeleteModalState} />
      )}
    </div>
  );
};

export default Reply;
