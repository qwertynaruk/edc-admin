import { Spin } from 'antd';
import PropTypes from 'prop-types';
import { LoadingOutlined } from '@ant-design/icons';

const Icon = <LoadingOutlined style={{ fontSize: 35 }} spin />;

const Loading = (props) => {
  const { align, cover } = props;
  return (
    <div className="d-flex h-100" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#003a61' }} spin />} />
    </div>
  );
};

Loading.propTypes = {
  size: PropTypes.string,
  cover: PropTypes.string,
};

Loading.defaultProps = {
  align: 'center',
  cover: 'inline',
};

export default Loading;
