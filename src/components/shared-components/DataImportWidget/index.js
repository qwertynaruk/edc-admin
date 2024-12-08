import { Button, Card, Modal, Space, Typography, Upload } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, UploadOutlined } from '@ant-design/icons';

import S3UploadStore from 'mobx/S3UploadStore';
import Swal from 'sweetalert2';
import _ from 'lodash';
import styled from '@emotion/styled';
import { useState } from 'react';

const ScrollListContainer = styled.div`
  background-color: #37425666;
  display: flex;
  flex-direction: column;
  align-items: baseline;
  line-height: 1.75em;
`;

const DataImportWidget = ({
  downloadOption = {
    enable: false,
    url: '',
  },
  originModule = '',
  originModuleMultiple = [],
  exportType = '',
  pathBK = '',
  objectIDReplaceUserID = false,
}) => {
  const [uploadStatus, setUploadStatus] = useState('draft');
  const [catchLog, setCatchLog] = useState([]);
  const [catchMessage, setCatchMessage] = useState('');

  const onDownloadTemplate = () => {
    window.open(downloadOption.url, '_blank');
  };

  const onUploadChange = async (e) => {
    const { file } = e;

    if (file.status === 'done') {
      Swal.fire({
        title: 'กรุณารอสักครู่',
        html: 'ระบบกำลังอัปโหลดไฟล์ของท่าน',
        timer: 0,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      S3UploadStore.doUploadS3({ bucketName: pathBK || 'import', objectIDReplaceUserID, file }).then((ss) => {
        onUploadSuccess(ss);
      });
    }
  };

  const onUploadSuccess = async (data) => {
    const { key = '' } = data;

    const chooseModule = originModuleMultiple.length > 0 ? originModuleMultiple : originModule;

    const dataPostImport = { data_types: chooseModule, path: key };
    if (exportType) {
      dataPostImport.export_type = exportType;
    }
    S3UploadStore.doImportSource(dataPostImport)
      .then(() => {
        setUploadStatus('success');
      })
      .catch((msg) => {
        const { error = [], message = '' } = msg;
        setCatchLog(error);
        setCatchMessage(message);
        setUploadStatus('error');
      })
      .finally(() => {
        Swal.close();
      });
  };

  const onAcceptRules = () => {
    setCatchLog(null);
    setUploadStatus('draft');
  };

  return (
    <>
      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        {downloadOption.enable && (
          <Space align="center">
            <Typography.Text>สร้างเทมเพลตสำหรับการนำเข้าข้อมูล</Typography.Text>
            <Button type="primary" onClick={onDownloadTemplate}>
              สร้างเทมเพลต
            </Button>
          </Space>
        )}

        <Card
          className="gx-mt-4 gx-mb-0"
          style={{ borderColor: '#fff', borderWidth: 3, borderStyle: 'dashed' }}
          bodyStyle={{ textAlign: 'center' }}
        >
          <Upload
            showUploadList={false}
            accept=".xls, .xlsx"
            customRequest={({ _, onSuccess }) => onSuccess('ok')}
            onChange={onUploadChange}
          >
            <Space direction="vertical gx-my-5" style={{ textAlign: 'center' }} size={20}>
              {uploadStatus !== 'success' && (
                <>
                  <UploadOutlined style={{ fontSize: '6em' }} />
                  <Typography.Text strong>เลือกไฟล์ที่ต้องการอัปโหลด</Typography.Text>
                </>
              )}

              {uploadStatus === 'success' && (
                <>
                  <CheckCircleOutlined style={{ fontSize: '6em', color: '#28A745' }} />
                  <Typography.Text strong>อัปโหลดข้อมูลสำเร็จ</Typography.Text>
                </>
              )}

              <Button type="primary">อัปโหลดข้อมูล</Button>
            </Space>
          </Upload>
        </Card>
      </Card>

      {uploadStatus === 'error' && (
        <Modal
          visible={uploadStatus === 'error'}
          width={700}
          centered
          forceRender
          footer={null}
          closable={false}
          maskClosable={false}
          bodyStyle={{ backgroundColor: '#1c2536' }}
        >
          <Space className="gx-space-full-width" direction="vertical" align="center" size={15}>
            <CloseCircleOutlined style={{ color: '#FF3744', fontSize: 60 }} />
            <Typography.Text strong>อัปโหลดข้อมูลไม่สำเร็จ</Typography.Text>

            <ScrollListContainer className="gx-my-4 gx-py-2 gx-px-3">
              {catchLog.length > 0 ? (
                <>
                  <Typography.Text strong>{catchMessage}</Typography.Text>
                  <br />
                  {catchLog.map((el, _index) => (
                    <Typography.Text key={_index}>
                      Row {_.get(el, 'row', '-')}, Column {_.get(el, 'col', '-')} ยังไม่ได้ใส่ข้อมูลหรือข้อมูลไม่ถูกต้อง
                    </Typography.Text>
                  ))}
                </>
              ) : (
                <Typography.Text>{catchMessage}</Typography.Text>
              )}
            </ScrollListContainer>

            <Button onClick={onAcceptRules} type="primary">
              ตกลง
            </Button>
          </Space>
        </Modal>
      )}
    </>
  );
};

export default DataImportWidget;
