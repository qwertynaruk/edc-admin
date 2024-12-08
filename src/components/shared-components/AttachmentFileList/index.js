// import { PaperClipOutlined } from '@ant-design/icons';
import { Empty, Image, Space, Typography } from 'antd';

const AttachmentFileList = ({ dataList = [], enableEmpty = true }) => {
  // const spliceFileName = (fname) => {
  //   const _fname = fname.split('/');

  //   return _fname[_fname.length - 1];
  // };

  if (dataList.length <= 0 && enableEmpty) {
    return <Empty description={<Typography.Text strong>ไม่พบรายการ</Typography.Text>} style={{ opacity: 0.4 }} />;
  }

  return (
    <Space direction="vertical">
      {dataList
        .filter((ss) => ss)
        .map((el, _index) => (
          <div key={_index}>
            <Image.PreviewGroup>
              <Image width={100} height={100} src={el} />
            </Image.PreviewGroup>
            {/* <Button key={_index} icon={<PaperClipOutlined />} type="link" ghost href={el} target="_blank">
              {spliceFileName(el)}
            </Button> */}
          </div>
        ))}
    </Space>
  );
};

export default AttachmentFileList;
