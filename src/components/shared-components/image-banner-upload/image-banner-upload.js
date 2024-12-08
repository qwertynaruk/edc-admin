import { Card, Typography, Upload } from 'antd';

import { PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { useState } from 'react';
import { useUploadFileManagementPublic } from 'features/shared';

export const ImageBannerUpload = ({
  value,
  onChange,
  bucketName,
  module,
  group,
  fileName,
  width = 0,
  height = 0,
  fetcher = () => {},
  icon = <PlusOutlined />,
}) => {
  const [fileUpload, setFileUpload] = useState(null);
  const { submit } = useUploadFileManagementPublic({
    bucketName,
    module,
    group,
    fileName,
    onSuccess: (data) => {
      onChange?.(data.body.public_url);
      setFileUpload(data.body.public_url);
    },
  });

  const onUpload = (file) => {
    submit({
      file,
    });
    fetcher?.();
    return false;
  };
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <>
      <Upload
        beforeUpload={onUpload}
        showUploadList={false}
        // onPreview={handlePreview}
        // fileList={fileList}
        accept="image/*"
        className={css`
          .ant-upload {
            width: 100%;
            cursor: pointer;
          }
        `}
      >
        {fileUpload || value ? (
          <img src={`${fileUpload || value}?${new Date().getTime()}`}></img>
        ) : (
          <Card
            className={css`
              width: 100%;
              min-width: ${width}px;
              min-height: ${height}px;
              border: ${value ? 'unset' : ' 1px dashed #d9d9d9 !important;'};

              .ant-card-body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 180px;
                width: 100%;
                gap: 8px;

                background-image: ${fileUpload || value
                  ? `url(${fileUpload || value}?${new Date().getTime()})`
                  : 'none'};
                background-size: contain;
                background-position: center;
                background-repeat: no-repeat;

                :hover {
                  background-color: rgba(0, 0, 0, 0.5);
                }
              }
            `}
          >
            {fileUpload || value ? null : (
              <>
                {icon}
                <Typography.Text>อัพโหลดรูปภาพ</Typography.Text>
                <Typography.Text>ขนาด (กว้าง) X (ยาว)</Typography.Text>
              </>
            )}
          </Card>
        )}
      </Upload>
    </>
  );
};
