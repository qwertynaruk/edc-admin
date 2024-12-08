/* eslint-disable camelcase */
import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Space, Spin, Typography, Upload } from 'antd';
import { GuardHandles } from 'components/shared-components/Guarded';
import _ from 'lodash';
import { observer } from 'mobx-react';
import ReportStore from 'mobx/ReportStore';
import S3UploadStore from 'mobx/S3UploadStore';
import { useEffect, useMemo, useState } from 'react';

const { Text } = Typography;

const AttachmentFile = ({ iRef, guardedProps }) => {
  const bucketName = 'report';
  const [itemFileList, setItemFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const canUpdate = GuardHandles(guardedProps);

  const { reportItems } = ReportStore;
  const reportId = _.get(reportItems, '_id', '-');
  const reportAttachments = _.get(reportItems, 'report_attachments', []);
  const reportExported = _.get(reportItems, 'is_exported', false);
  const isDisabledForm = reportExported && _.get(reportItems, 'notification.status') !== 'รอดำเนินการ';

  useEffect(() => {
    setItemFileList(reportAttachments);
  }, [reportItems]);

  const onUploadChange = (file, fileList) => {
    setItemFileList(fileList);
    setLoading(true);

    if (file.status === 'uploading') {
      S3UploadStore.doUploadS3({ bucketName, file }).then((ss) => {
        const { url = '' } = ss;
        setItemFileList(fileList.map((e) => ({ ...e, name: url.includes(e.name) ? url : e.name })));
        onUpdateForm(reportAttachments.concat(url));
      });
    }

    if (file.status === 'removed') {
      const { name = '' } = file;

      S3UploadStore.doDeleteS3(name).then(() => {
        onUpdateForm(reportAttachments.filter((ss) => !ss.includes(name)));
      });
    }
  };

  const onUpdateForm = (fileRes) => {
    ReportStore.updateReport(
      {
        report_attachments: fileRes,
      },
      reportId
    )
      .catch(() => {
        setItemFileList(reportAttachments);
      })
      .finally(() => setLoading(false));
  };

  const isShouldFilelist = useMemo(() => {
    let fileList = itemFileList || [];

    const getName = (url = '') => url.split('/').pop();
    const getUID = (url = '') => {
      const split = url.split('-');
      return [split[2], split[3]].join('-');
    };

    fileList = fileList.map((x) => ({
      ...x,
      name: x.name ? getName(x.name) : getName(x),
      uid: x.uid ? x.uid : getUID(getName(x)),
      url: typeof x === 'string' ? x : x.url,
    }));
    return fileList;
  }, [itemFileList]);

  return (
    <Card ref={(el) => (iRef.current['เอกสารแนบ'] = el)}>
      <Text strong>เอกสารแนบ</Text>

      <Spin spinning={loading}>
        <div className="gx-mt-4">
          <Upload
            fileList={isShouldFilelist}
            customRequest={({ _, onSuccess }) => onSuccess('ok')}
            onChange={({ file, fileList }) => onUploadChange(file, fileList)}
            disabled={isDisabledForm || !canUpdate}
          >
            <Space direction="vertical">
              <Button loading={loading} icon={<UploadOutlined />} disabled={isDisabledForm || !canUpdate}>
                อัปโหลด
              </Button>
            </Space>
          </Upload>
        </div>
      </Spin>
    </Card>
  );
};

export default observer(AttachmentFile);
