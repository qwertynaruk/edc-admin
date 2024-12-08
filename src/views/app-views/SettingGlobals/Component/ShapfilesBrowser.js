import { css } from '@emotion/css';
import { Button, Upload } from 'antd';
import produce from 'immer';

const getJSONContent = async (file) => {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result));
      } catch (error) {
        reject(error);
      }
    };
  });
};

const ShapefilesBrowser = (props) => {
  const request = (request) => {
    const { file, onSuccess, onError } = request;
    onSuccess({ file });
  };
  const onChange = (info) => {
    const { file } = info;
    if (file.status === 'done') {
      getJSONContent(file.originFileObj)
        .then((content) => {
          if (props.onChange) props.onChange({ file, content });
        })
        .catch((error) => {
          if (props.onChange)
            props.onChange({
              file: produce(file, (draft) => {
                draft.status = 'error';
              }),
            });
          return error;
        });
    } else {
      if (props.onChange) props.onChange({ file });
    }
  };
  return (
    <Upload
      maxCount={1}
      showUploadList={false}
      accept=".json"
      onChange={onChange}
      customRequest={request}
      className={css`
        .ant-upload {
          width: 100%;
        }
      `}
    >
      <Button className="gx-w-100" type="primary">
        นำเข้าข้อมูล geojson
      </Button>
    </Upload>
  );
};
export default ShapefilesBrowser;
