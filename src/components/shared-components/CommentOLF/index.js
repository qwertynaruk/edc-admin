import { useEffect, useState } from 'react';
import './Components/Styles/index.scss';
import Comment from './Components/Comment';
import AddComment from './Components/AddComment';
import { CommentOutlined, PaperClipOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Card, Col, Image, Row, Space, Typography } from 'antd';
import 'video-react/dist/video-react.css';
import PlayVideos from '../VideosComponent/index';
const CommentOLF = ({ dataSource = [], canEditebled = false, onSubmitComment = () => {} }) => {
  const [comments, updateComments] = useState([]);
  const [deleteModalState, setDeleteModalState] = useState(false);
  const [attachmentList, setAttachmentList] = useState([]);

  useEffect(() => {
    updateComments(dataSource);
    setAttachmentList([]);
  }, [dataSource]);

  useEffect(() => {
    deleteModalState
      ? document.body.classList.add('overflow--hidden')
      : document.body.classList.remove('overflow--hidden');
  }, [comments, deleteModalState]);

  // update score
  const updateScore = (score, id, type) => {
    const updatedComments = [...comments];

    if (type === 'comment') {
      updatedComments.forEach((data) => {
        if (data.id === id) {
          data.score = score;
        }
      });
    } else if (type === 'reply') {
      updatedComments.forEach((comment) => {
        comment.replies.forEach((data) => {
          if (data.id === id) {
            data.score = score;
          }
        });
      });
    }
    updateComments(updatedComments);
  };

  // add comments
  const addComments = (newComment) => {
    const updatedComments = [...comments, { ...newComment, attachment_url: attachmentList }];

    updateComments(updatedComments);
    onSubmitComment(updatedComments);
  };

  // add replies
  const updateReplies = (replies, id) => {
    const updatedComments = [...comments];
    updatedComments.forEach((data) => {
      if (data.id === id) {
        data.replies = [...replies];
      }
    });
    updateComments(updatedComments);
  };

  // edit comment
  const editComment = (message, id, type) => {
    const updatedComments = [...comments];

    if (type === 'comment') {
      updatedComments.forEach((data) => {
        if (data.id === id) {
          data.message = message;
        }
      });
    } else if (type === 'reply') {
      updatedComments.forEach((comment) => {
        comment.replies.forEach((data) => {
          if (data.id === id) {
            data.message = message;
          }
        });
      });
    }

    updateComments(updatedComments);
  };

  // delete comment
  const commentDelete = (id, type, parentComment) => {
    let updatedComments = [...comments];
    let updatedReplies = [];

    if (type === 'comment') {
      updatedComments = updatedComments.filter((data) => data.id !== id);
    } else if (type === 'reply') {
      comments.forEach((comment) => {
        if (comment.id === parentComment) {
          updatedReplies = comment.replies.filter((data) => data.id !== id);
          comment.replies = updatedReplies;
        }
      });
    }

    updateComments(updatedComments);
  };

  return (
    <main className="App gx-mb-5">
      <Typography.Title level={5} style={{ fontWeight: 400 }}>
        <CommentOutlined /> แสดงความคิดเห็น ({comments.length})
      </Typography.Title>

      {comments.map((comment, _index) => (
        <Comment
          key={_index}
          commentData={comment}
          updateScore={updateScore}
          updateReplies={updateReplies}
          editComment={editComment}
          commentDelete={commentDelete}
          setDeleteModalState={setDeleteModalState}
          canEditebled={canEditebled}
        />
      ))}
      <AddComment addComments={addComments} attachmentList={attachmentList} setAttachmentList={setAttachmentList} />
    </main>
  );
};

export default CommentOLF;

export const RenderRelateAttachmentFile = ({ title = '', dataSource = [] }) => {
  if (dataSource.length <= 0) {
    return false;
  }

  function separateVideoAndImageLinks(links) {
    const videoLinks = [];
    const imageLinks = [];

    links.forEach((link) => {
      // Use regular expressions to check if the link is a video or image
      if (link.match(/\.(mp4|avi|mkv|mov|flv)$/i)) {
        videoLinks.push(link);
      } else if (link.match(/\.(jpg|jpeg|png|gif|bmp)$/i)) {
        imageLinks.push(link);
      }
    });

    return { videoLinks, imageLinks };
  }

  const { videoLinks, imageLinks } = separateVideoAndImageLinks(dataSource);

  return (
    <>
      <Card title={title}>
        <Space direction="vertical">
          {imageLinks.length > 0 && (
            <>
              <Typography.Text>
                <PaperClipOutlined /> ไฟล์รูปภาพ
              </Typography.Text>
              <Image.PreviewGroup>
                {imageLinks.map((image, index) => (
                  <Image key={index} width={200} height={200} src={image} />
                ))}
              </Image.PreviewGroup>
            </>
          )}
          {videoLinks.length > 0 && (
            <>
              <Typography.Text>
                <VideoCameraOutlined /> ไฟล์วิดีโอ
              </Typography.Text>
              <div>
                <Row>
                  {videoLinks.map((rowVideo, index) => (
                    <Col key={index} className="gutter-row" span={6}>
                      <div>
                        <PlayVideos form={rowVideo} />
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </>
          )}
          {/* {dataSource.map((_source, _index) => (
            <Typography.Text key={_index}>
              <a href={_source}>
                <PaperClipOutlined /> {_source}
              </a>
            </Typography.Text>
          ))} */}
        </Space>
      </Card>
    </>
  );
};

export const RenderRelateImageFile = ({ title = '', dataSource = [] }) => {
  if (dataSource.length <= 0) {
    return false;
  }

  return (
    <Card title={title}>
      <Row className="gx-flex-row">
        {dataSource
          .filter((ss) => ss?.url)
          .map((_source, _index) => (
            <Col key={_index} span={4} style={{ textAlign: 'center' }}>
              <Image src={_source?.url} height={150} />
            </Col>
          ))}
      </Row>
    </Card>
  );
};
