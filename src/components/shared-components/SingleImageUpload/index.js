import { useEffect, useState } from 'react';
import { Image, Space, Spin, Typography, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import S3UploadStore from 'mobx/S3UploadStore';

const { Text } = Typography;

const SingleImageUpload = (props) => {
  const { form, bucketName = 'main', fieldName, onSuccess, value = null, json = false } = props;
  const defaultImageSource = () => {
    if (!value) return null;
    if (!json) return value;
    return value.url || value;
  };
  const [imageSource, setImageSource] = useState(defaultImageSource());
  const [imageIndexId, setImageIndexId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (value) {
      setImageSource(defaultImageSource());
      return;
    }
    const field = form?.getFieldValue(fieldName);
    if (field) {
      setImageSource(field);
    }
  }, [form, fieldName, value]);

  const onProfileUploadChange = async (e) => {
    setLoading(true);

    const { file } = e;

    if (imageIndexId) {
      const tx = form?.getFieldValue('s3_upload_key') || [];
      if (tx.length > 0) {
        form.setFieldsValue({
          s3_upload_key: tx.filter((unit) => !unit.includes(imageIndexId)),
        });
      }
    }

    if (file.status === 'done') {
      S3UploadStore.doUploadS3({ bucketName, file })
        .then((ss) => {
          onUploadSuccess(ss, file);
        })
        .finally(() => setLoading(false));
    }
  };

  const onUploadSuccess = async (data, file) => {
    const { key, url } = data;
    const tx = form?.getFieldValue('s3_upload_key') || [];

    if (props.onChange) props.onChange(data, file);

    form?.setFieldsValue({
      [fieldName]: json ? data : url,
      s3_upload_key: [key].concat(tx),
    });

    // const tm = await convertFileToBase64(file);
    setImageSource(url);
    setImageIndexId(file.uid);
    if (onSuccess) onSuccess({ [fieldName]: data });
  };

  return (
    <Upload
      listType="picture-card"
      className="gx-profile-upload"
      showUploadList={false}
      onPreview={true}
      customRequest={({ file, onSuccess }) => onSuccess('ok')}
      onChange={onProfileUploadChange}
    >
      {imageSource ? (
        <Spin spinning={loading}>
          <Image src={imageSource} alt="udon-cop" preview={false} fallback="/img/thumb-avatar/default.png" />
        </Spin>
      ) : (
        <Space direction="vertical">
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <Text style={{ fontSize: 12 }}>{loading ? 'กำลังประมวลผล' : 'คลิกเพื่ออัปโหลดรูปภาพ'}</Text>
        </Space>
      )}
    </Upload>
  );
};

export default SingleImageUpload;
