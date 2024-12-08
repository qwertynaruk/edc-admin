import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Space, Typography, Upload } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import S3UploadStore from 'mobx/S3UploadStore';

const { Text } = Typography;

const MultipleFileUpload = ({
  form,
  fieldName,
  bucketName = 'main',
  uploadType = 'file',
  viewOnly = false,
  onSuccess,
  json = false,
  maxCount = null,
  value,
}) => {
  const defaultFileList = useCallback(() => {
    if (!value) return [];
    if (!json) return value;
    if (!Array.isArray(value)) return value;
    return value.map((item) => {
      if (item.url) return item.url;
      return item;
    });
  }, [json, value]);

  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    setImageList(defaultFileList());
  }, [defaultFileList]);

  const onUploadChange = (file, fileList) => {
    setImageList(fileList);

    if (file.status === 'uploading') {
      S3UploadStore.doUploadS3({ bucketName, file }).then((ss) => {
        onUploadSuccess(ss, fileList);
      });
    }

    if (file.status === 'removed') {
      const tx = form?.getFieldValue('s3_upload_key') || [];

      if (tx.length > 0) {
        form.setFieldsValue({
          s3_upload_key: tx.filter((unit) => !unit.includes(file.uid)),
        });
      }

      if (Array.isArray(fieldName)) {
        inCaseFieldTypeOfArray.formRemove(file);
      } else {
        inCaseFieldTypeOfString.formRemove(file);
      }
    }
  };

  const onUploadSuccess = async (data, fileList) => {
    const { key = '', url } = data;
    const tx = form?.getFieldValue('s3_upload_key') || [];

    setImageList(fileList.map((e) => ({ ...e, name: url.includes(e.name) ? url : e.name })));

    if (Array.isArray(fieldName)) {
      inCaseFieldTypeOfArray.formSubmit(key, url, tx, data);
    } else {
      inCaseFieldTypeOfString.formSubmit(key, url, tx, data);
    }

    if (onSuccess) onSuccess({ [fieldName]: data });
  };

  const inCaseFieldTypeOfString = {
    formSubmit: (key, url, tx, data) => {
      const fieldArr = form.getFieldValue(fieldName) || [];

      form.setFieldsValue({
        [fieldName]: fieldArr.concat(json ? data : url),
        s3_upload_key: [key].concat(tx),
      });
    },
    formRemove: (file) => {
      const fieldArr = form.getFieldValue(fieldName) || [];
      if (fieldArr.length > 0) {
        form.setFieldsValue({
          [fieldName]: fieldArr.filter((unit) => !unit.includes(file.uid)),
        });
      }
    },
  };

  const inCaseFieldTypeOfArray = {
    formSubmit: (key, url, tx) => {
      const fieldArr = form.getFieldValue(fieldName[0]);
      const byIndex = fieldArr[fieldName[1]][fieldName[2]] || [];

      form.setFieldsValue({
        [fieldName[0]]: fieldArr.map((ez, _index) => ({
          ...ez,
          [fieldName[2]]: _index === fieldName[1] ? byIndex.concat(url) : ez[fieldName[2]],
        })),
        s3_upload_key: [key].concat(tx),
      });
    },
    formRemove: (file) => {
      const fieldArr = form.getFieldValue(fieldName[0]);
      const byIndex = fieldArr[fieldName[1]][fieldName[2]] || [];

      form.setFieldsValue({
        [fieldName[0]]: fieldArr.map((ez, _index) => ({
          ...ez,
          [fieldName[2]]:
            _index === fieldName[1] ? byIndex.filter((unit) => !unit.includes(file.uid)) : ez[fieldName[2]],
        })),
      });
    },
  };

  const ComsProps = {
    file: {},
    image: {
      listType: 'picture-card',
      showUploadList: {
        showPreviewIcon: false,
      },
      accept: '.png, .jpg, .jpeg',
    },
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
    }));
    return fileList;
  }, [imageList]);

  return (
    <Upload
      {...ComsProps[uploadType]}
      maxCount={maxCount}
      fileList={isShouldFilelist}
      customRequest={({ file, onSuccess }) => onSuccess('ok')}
      onChange={({ file, fileList }) => onUploadChange(file, fileList)}
    >
      {viewOnly ? null : (
        <>
          {uploadType === 'image' && (
            <Space direction="vertical">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>อัปโหลดรูปภาพ</div>
            </Space>
          )}

          {uploadType === 'file' && (
            <Space direction="vertical">
              <Button icon={<UploadOutlined />}>อัปโหลด</Button>
            </Space>
          )}
        </>
      )}
    </Upload>
  );
};

export default MultipleFileUpload;
