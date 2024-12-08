import { Image, Space } from 'antd';
import { useEffect, useState } from 'react';

import { BUCKETNAME_SOS } from 'constants/SOSConstant';
import { PaperClipOutlined } from '@ant-design/icons';
import ReportService from 'services/ReportServices';
import _ from 'lodash';
import { css } from '@emotion/css';

export const CommentFileAttachmentsList = ({ attachmentsUrl = [] }) => {
  const [imageList, setImageList] = useState([]);
  const { mutateAsync: presignedDownload } = ReportService.usePresignedUpload({
    type: 'download',
  });

  const getDownloadFile = async (payload) => {
    if (_.isEmpty(payload)) return;
    return await presignedDownload(payload, {
      onSuccess: (response) => {
        if (response?.body?.url) {
          setImageList([...imageList, response?.body?.url]);
        }
      },
    });
  };

  async function printFiles() {
    const promisesDraft = [];
    const publicUrl = [];
    for (const rowImage of attachmentsUrl) {
      if (rowImage?.search('public') >= 0) {
        publicUrl.push(rowImage);
        continue;
      }
      const imageSplit = rowImage?.split('/');
      if (imageSplit.length >= 3) {
        const payloadDownload = {
          bucket_name: BUCKETNAME_SOS[1].value,
          module: imageSplit[0],
          group: imageSplit[1],
          file_extension: imageSplit[2].split('.').pop(),
          file_name: imageSplit[2],
          expires_in: 3600,
        };
        const callApi = getDownloadFile(payloadDownload);
        promisesDraft.push(callApi);
      }
    }

    await Promise.all(promisesDraft)
      .then((dataPm) => {
        setImageList((dataPm || []).map((rowData) => rowData?.body?.url));
      })
      .catch((err) => {
        setImageList([]);
        return { status: false, result: err };
      })
      .finally(() => {
        if (publicUrl.length > 0 && imageList.length === 0) {
          setImageList(publicUrl);
        } else if (publicUrl.length > 0 && imageList.length > 0) {
          setImageList(...imageList, ...publicUrl);
        }
      });
  }

  useEffect(() => {
    printFiles();
  }, [attachmentsUrl]);
  return (
    <>
      <Space>
        {(imageList || [])?.map((rowData, index) => (
          <Image key={index} width={100} height={100} src={rowData || ''} />
        ))}
      </Space>
      {false &&
        attachmentsUrl?.map((url) => (
          <div
            key={url}
            className={css`
              display: flex;
              align-items: center;
              gap: 8px;
              cursor: pointer;
              margin-top: 8px;

              a {
                color: #fff;
              }

              &:hover,
              a:hover {
                color: #1890ff;
              }
            `}
          >
            <PaperClipOutlined />
            <a href={url} target="_blank" rel="noreferrer">
              {url?.split('/').pop()}
            </a>
          </div>
        ))}
    </>
  );
};
