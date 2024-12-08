import { IMAGE_EXTENSIONS, VIDEO_EXTENSIONS } from 'constants/FileConstant';
import { Modal, Space, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { BUCKETNAME_SOS } from 'constants/SOSConstant';
import Flex from 'components/shared-components/Flex';
import ReportService from 'services/ReportServices';
import _ from 'lodash';
import { css } from '@emotion/css';
import useFileIcons from 'hooks/useFileIcons';
import { useToggle } from '@mantine/hooks';
import { v4 as uuid } from 'uuid';

export const MediaPreviewDialog = ({ media, open, onClose }) => {
  const extension = media.split('.').pop().toLowerCase()?.split('?').shift();
  const videoRef = useRef(null);
  useEffect(() => {
    if (!open && videoRef) {
      videoRef?.current?.pause();
    }
  }, [open, videoRef]);

  return (
    <Modal visible={open} onCancel={onClose} footer={null} width={800} centered>
      <Flex justifyContent="center">
        {IMAGE_EXTENSIONS.includes(extension) && (
          <img
            src={media}
            alt="attachment"
            className={css`
              width: auto;
              height: auto;
              max-height: 600px;
              text-align: center;
            `}
          />
        )}
        {VIDEO_EXTENSIONS.includes(extension) && (
          <video
            src={media}
            ref={videoRef}
            controls
            className={css`
              width: 100%;
              height: auto;
              max-height: 600px;
            `}
          />
        )}
      </Flex>
    </Modal>
  );
};

export const EventsDetailAttachmentsList = ({ attachments = [] }) => {
  const [isPreviewImageDialog, togglePreviewImageDialog] = useToggle();
  const [previewMedia, setPreviewMedia] = useState('');
  const [imageList, setImageList] = useState([]);

  const { render } = useFileIcons();

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
    for (const rowImage of attachments) {
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

  const onPreviewMedia = (media) => {
    setPreviewMedia(media);
    togglePreviewImageDialog();
  };

  const onClosePreviewMedia = () => {
    setPreviewMedia('');
    togglePreviewImageDialog();
  };

  const otherFiles =
    imageList?.filter((attachment) => {
      const extension = attachment.split('.').pop().toLowerCase()?.split('?').shift();
      return !IMAGE_EXTENSIONS.includes(extension) && !VIDEO_EXTENSIONS.includes(extension);
    }) || [];

  const onlyNames = (txt) => {
    try {
      const splitLv1 = txt?.split('?');
      const splitLv2 = splitLv1[0]?.split('/');
      const getFiles = splitLv2?.[splitLv2?.length - 1];
      return decodeURIComponent(getFiles);
    } catch (error) {
      return txt;
    }
  };

  useEffect(() => {
    printFiles();
  }, [attachments]);

  return (
    <>
      <div
        className={css`
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 12px;
        `}
      >
        {imageList
          ?.filter((attachment) => {
            const extension = attachment.split('.').pop().toLowerCase()?.split('?').shift();
            return IMAGE_EXTENSIONS.includes(extension) || VIDEO_EXTENSIONS.includes(extension);
          })
          ?.map((attachment, index) => {
            const extension = attachment.split('.').pop().toLowerCase()?.split('?').shift();
            return (
              <div key={uuid}>
                <div
                  onClick={() => onPreviewMedia(attachment)}
                  key={index}
                  className={css`
                    position: relative;
                    padding-top: 100%;
                    overflow: hidden;
                    border-radius: 8px;
                    border: 2px solid #f0f0f0;

                    background-image: url(${attachment});
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;

                    :hover {
                      cursor: pointer;
                      transform: scale(1.05);

                      ::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: url('/img/icons/EyeOutlined.svg') no-repeat center center;
                        background-size: 25px;
                        background-color: rgba(0, 0, 0, 0.5);
                        z-index: 1;
                      }
                    }
                  `}
                >
                  {VIDEO_EXTENSIONS.includes(extension) && (
                    <video
                      src={attachment}
                      controls
                      className={css`
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                      `}
                    />
                  )}
                </div>
                <div className="gx-text-center gx-mt-2">
                  <Typography.Text>{extension.toUpperCase()}</Typography.Text>
                </div>
              </div>
            );
          })}
      </div>

      {otherFiles.length > 0 && (
        <Space direction="vertical" gap={3} style={{ marginTop: 20 }}>
          {otherFiles.map((attachment, index) => (
            <div key={index}>
              {render(onlyNames(attachment), () => (
                <a href={attachment} target="_blank" rel="noreferrer">
                  {onlyNames(attachment)}
                </a>
              ))}
            </div>
          ))}
        </Space>
      )}
      <MediaPreviewDialog media={previewMedia} open={isPreviewImageDialog} onClose={onClosePreviewMedia} />
    </>
  );
};
