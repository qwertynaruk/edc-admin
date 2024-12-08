import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Space, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import Loading from 'components/shared-components/Loading';
import S3UploadStore from 'mobx/S3UploadStore';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

const getBase64 = async (file) => {
  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);

    reader.onload = () => resolve(reader.result);
  });
};
const ListItem = styled.div`
  width: 378px !important;
  height: 53px !important;
  margin: 0 !important;
  .ant-upload-list-item-info {
    &::before {
      background-color: rgba(58, 58, 58, 0.8) !important;
    }
  }
  &:hover {
    .ant-upload-list-item-info {
      &::before {
        opacity: 1 !important;
      }
    }
  }
  .ant-btn-link:after {
    border: none;
  }
`;
const UploadedItem = (props) => {
  const { file, actions, doNotUpdateSrc = false } = props;
  const [src, setSrc] = useState(file.url);

  useEffect(() => {
    if (doNotUpdateSrc) return;
    if (file.status !== 'done') return;
    getBase64(file).then((newSrc) => {
      setSrc(newSrc);
    });
  }, [doNotUpdateSrc, file]);

  return (
    <ListItem className="ant-upload-list-item ant-upload-list-picture-card">
      <div className="ant-upload-list-item-info">
        <span className="ant-upload-span">
          <a className="ant-upload-list-item-thumbnail" href="" target="_blank" rel="noopener noreferrer">
            {file.status === 'uploading' && <Loading />}
            {file.status === 'done' && <img src={src} />}
          </a>
        </span>
      </div>
      <span className="ant-upload-list-item-actions">
        <Space>
          <Button type="link" size="small" onClick={() => actions.preview()}>
            <EyeOutlined />
          </Button>
          <Button type="link" onClick={() => actions.remove()}>
            <DeleteOutlined />
          </Button>
        </Space>
      </span>
    </ListItem>
  );
};

const SignatureUpload = (props) => {
  const { bucketName = 'signature' } = props;
  const [fileList, setFileList] = useState([]);
  const [value, setValue] = useState(props.value);
  const onChange = (e) => {
    setFileList(e.fileList);
  };
  const onPreview = async (file) => {
    let src = file.url;

    if (!src) {
      src = await getBase64(file);
    }

    const image = new window.Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  const addS3Key = (key) => {
    if (props.form) {
      const s3UploadKey = new Set(props.form.getFieldValue('s3_upload_key') || []);
      s3UploadKey.add(key);
      props.form.setFieldsValue({ s3_upload_key: Array.from(s3UploadKey) });
    }
  };
  const removeS3Key = (key) => {
    const s3UploadKey = new Set(props.form.getFieldValue('s3_upload_key') || []);
    s3UploadKey.delete(key);
    props.form.setFieldsValue({ s3_upload_key: Array.from(s3UploadKey) });
  };
  const upload = (request) => {
    const { file, onSuccess, onError } = request;
    S3UploadStore.doUploadS3({ bucketName, file: { uid: file.uid, name: file.name, originFileObj: file } }).then(
      (elm) => {
        if (!elm) return onError('Upload failed');
        addS3Key(elm.key);
        setValue(elm);
        return onSuccess(elm);
      }
    );
  };

  useEffect(() => {
    if (value && value.url) {
      if (props.onChange) props.onChange(value.url);
      return;
    }
    setValue(props.value);
  }, [props, props.value, value]);

  if (value) {
    const url = value.url || value;
    return (
      <UploadedItem
        doNotUpdateSrc={true}
        file={{ url, status: 'done' }}
        actions={{
          preview: () => {
            const imgWindow = window.open(url);
            imgWindow?.document.write(`<img src="${url}" />`);
          },
          remove: () => {
            setFileList([]);
            setValue(null);
            if (props.onChange) props.onChange('');
            removeS3Key(value.key);
          },
        }}
      />
    );
  }

  return (
    <ImgCrop modalTitle="ครอบตัดรูปภาพ" aspect={188 / 26} modalCancel="ยกเลิก" modalOk="ถัดไป" {...props}>
      <Upload
        maxCount={1}
        showUploadList={true}
        fileList={fileList}
        onChange={onChange}
        onPreview={onPreview}
        customRequest={upload}
        itemRender={(_, file, __, actions) => {
          return <UploadedItem file={file} actions={actions} />;
        }}
      >
        {!fileList.length && <Button type="primary">คลิกเพื่ออัปโหลดรูปภาพ</Button>}
      </Upload>
    </ImgCrop>
  );
};

export default SignatureUpload;
