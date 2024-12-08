import { Avatar, Button, Col, Image, Row, Space, Spin, Typography, Upload, message } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import { GalleryAddIcon } from 'assets/svg';
import { last } from 'lodash';
import styled from '@emotion/styled';
import { useS3Upload } from 'features/s3';
import { useState } from 'react';

const { Dragger } = Upload;

export function LostFoundUploadImage({ onChange }) {
  const [fileList, setFileList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const {
    mutate: mutateUpload,
    isPending: isPendingUpload,
    forceRequest,
  } = useS3Upload({
    onSuccess: (res) => {
      const newFileList = fileList.map((ss) => {
        if (ss.uid === res?.uid) {
          const newSets = {
            ...ss,
            status: 'done',
            url: res?.url,
            name: res?.file_name,
            response: res,
          };

          return newSets;
        }

        return ss;
      });

      setFileList(newFileList);
      onChange?.(newFileList);
      messageApi.success(`อัปโหลดไฟล์ (${res?.file_name}) สำเร็จ`);
    },
    onError: () => {
      const newFileList = fileList.map((ss) => {
        if (ss.status === 'uploading') {
          const newSets = {
            ...ss,
            status: 'error',
          };

          return newSets;
        }

        return ss;
      });

      setFileList(newFileList);
      messageApi.error('ไม่สามารถอัปโหลดไฟล์นี้ได้ กรุณาลองใหม่อีกครั้ง');
    },
  });

  const onUploadChange = async ({ file, fileList }) => {
    setFileList(
      fileList.map((ss) => ({
        ...ss,
        status: ss.uid === file.uid ? 'uploading' : 'done',
      }))
    );

    if (file.status === 'done') {
      await mutateUpload({
        fileName: file.name,
        fileExtension: last(file.name.split('.')),
        files: file.originFileObj,
        module: 'lostfound',
        uid: file.uid,
      });
    }
  };

  const onMoveToTrash = (uid) => {
    try {
      const newFileList = fileList.filter((ss) => ss.uid !== uid);
      setFileList(newFileList);
      messageApi.success(`ลบไฟล์สำเร็จ`, 1000);
    } catch (error) {
      messageApi.error(`ไม่สามารถลบไฟล์นี้ได้ กรุณาลองใหม่อีกครั้ง`);
    }
  };

  const cssCustomProps = {
    position: 'absolute',
    width: '100%',
    left: 0,
    top: 25,
    opacity: 0.3,
  };

  return (
    <Space direction="vertical" style={{ marginBottom: 10 }}>
      {contextHolder}
      <Typography.Text strong>อัปโหลดรูปภาพ</Typography.Text>
      <Typography.Text>รูปภาพ 1/5 - คุณสามารถเพิ่มรูปภาพได้ถึง 5 รูป</Typography.Text>
      <Spin spinning={isPendingUpload}>
        <DraggerContainer
          multiple
          name="file"
          showUploadList={false}
          fileList={fileList}
          customRequest={forceRequest}
          onChange={onUploadChange}
        >
          <div className="dragger-box">
            <Space direction="vertical" align="center" style={fileList.length > 0 ? cssCustomProps : {}}>
              <Avatar icon={<GalleryAddIcon />} />
              <Typography.Text strong>เพิ่มรูปภาพ</Typography.Text>
              <Typography.Text style={{ fontSize: 12 }}>หรือลากแล้ววาง</Typography.Text>
            </Space>

            {fileList.length > 0 && (
              <Row style={{ flexDirection: 'row' }}>
                {fileList.map((items, index) => (
                  <Col key={index} xs={4}>
                    <Spin spinning={items.status === 'uploading'}>
                      <Space direction="vertical" style={{ border: '1px solid #000', borderRadius: 3 }}>
                        <ImageItemsContainer>
                          <Image src={items.url} alt="edc" />
                        </ImageItemsContainer>
                        <Button
                          key="remove"
                          danger
                          type="text"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveToTrash(items.uid);
                          }}
                          icon={<DeleteOutlined />}
                        ></Button>
                      </Space>
                    </Spin>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </DraggerContainer>
      </Spin>
    </Space>
  );
}

const DraggerContainer = styled(Dragger)({
  border: 'unset !important',
  '.ant-upload': {
    padding: '0px !important',
  },
  '.dragger-box': {
    border: '1px solid #000',
    borderRadius: 5,
    backgroundColor: '#202735',
    padding: 10,
  },
  '.ant-avatar': {
    border: '1px solid #000',
    width: 50,
    height: 50,
    background: 'rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ImageItemsContainer = styled.div({
  width: 'auto',
  height: 100,
  '.ant-image': {
    height: '100%',
    '> img': {
      height: '100%',
    },
  },
});
