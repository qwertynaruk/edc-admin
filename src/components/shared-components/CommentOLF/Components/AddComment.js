import './Styles/AddComment.scss';

import { Avatar, Button, Form, Image, Input, Space, Upload } from 'antd';
import { PaperClipOutlined, SendOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';

import { BUCKETNAME_SOS } from 'constants/SOSConstant';
import DialogNotification from 'components/shared-components/DialogNotification';
import S3UploadStore from 'mobx/S3UploadStore';
import UserStore from 'mobx/UserStore';
import moment from 'moment';
import { observer } from 'mobx-react';
import styled from '@emotion/styled';

const AddComment = ({
  addComments,
  replyingTo,
  bucketName = BUCKETNAME_SOS[1].value,
  attachmentList,
  setAttachmentList = () => {},
}) => {
  const [form] = Form.useForm();
  const replyingToUser = replyingTo ? `@${replyingTo}, ` : '';
  const [comment, setComment] = useState('');
  const [imageList, setImageList] = useState([]);

  const { auth_id = '' } = UserStore.accessAuthen;
  const { first_name = '', last_name = '', prefix_name = '' } = UserStore.user;

  useEffect(() => {
    if (attachmentList.length <= 0) {
      setImageList([]);
    }
  }, [attachmentList]);

  const clickHandler = () => {
    if (comment === '' || comment === ' ') {
      DialogNotification('warning', 'กรุณาเขียนความคิดเห็น');
      return;
    }

    const newComment = {
      auth_id,
      first_name,
      last_name,
      prefix_name,
      message: replyingToUser + comment,
      created_at: moment().toISOString(),
    };

    addComments(newComment);
    setComment('');
  };

  const onUploadChange = (file, fileList) => {
    setImageList(fileList);

    if (file.status === 'uploading') {
      S3UploadStore.doUploadS3({ bucketName, file }).then((ss) => {
        onUploadSuccess(ss, fileList);
      });
    }

    if (file.status === 'removed') {
      const tx = form.getFieldValue('s3_upload_key') || [];

      if (tx.length > 0) {
        form.setFieldsValue({
          s3_upload_key: tx.filter((unit) => !unit.includes(file.uid)),
        });
      }

      if (attachmentList.length > 0) {
        const fieldArr = attachmentList.filter((unit) => !unit.key.includes(file.uid)).map((ss) => ss.url);
        setAttachmentList(fieldArr);
      }
    }
  };

  const onUploadSuccess = async (data, fileList) => {
    const { url } = data;
    setImageList(fileList.map((e) => ({ ...e, name: url.includes(e.name) ? url : e.name })));

    const fieldArr = attachmentList.concat(url);
    setAttachmentList(fieldArr);
  };

  const getName = (url = '') => url.split('/').pop();
  const getUID = (url = '') => {
    const split = url.split('-');
    return [split[2], split[3]].join('-');
  };

  const isShouldFilelist = useMemo(() => {
    let fileList = imageList || [];

    fileList = imageList.map((x) => ({
      ...x,
      name: x.name ? getName(x.name) : getName(x),
      uid: x.uid ? x.uid : getUID(getName(x)),
      url: typeof x === 'string' ? x : x.url,
      status: 'done',
    }));
    return fileList;
  }, [imageList]);

  return (
    <>
      <div className="add-comment">
        <Avatar size={42} icon={<Image src="" fallback="https://app.udoncop.com/img/thumb-avatar/personel.png" />} />

        <Input
          type="text"
          className="comment-input"
          placeholder="เขียนความคิดเห็น..."
          value={replyingToUser + comment}
          onChange={(e) => {
            setComment(e.target.value.replace(replyingTo ? `@${replyingTo}, ` : '', ''));
          }}
          onPressEnter={clickHandler}
        />
        <div className="send-btn-container">
          <Space>
            <UploadStyledForComment
              fileList={isShouldFilelist}
              customRequest={({ _, onSuccess }) => onSuccess('ok')}
              onChange={({ file, fileList }) => onUploadChange(file, fileList)}
              className="senerio-list"
            >
              <Button className="add-btn">
                <PaperClipOutlined />
              </Button>
            </UploadStyledForComment>
            <Button className="add-btn" ghost onClick={clickHandler}>
              <SendOutlined />
            </Button>
          </Space>
        </div>
      </div>
    </>
  );
};

export default observer(AddComment);

const UploadStyledForComment = styled(Upload)`
  & div.ant-upload-list.ant-upload-list-text {
    top: 70px;
    left: 26px;
    max-width: 500px;
    max-height: 61px;
    overflow: hidden;
  }
`;
