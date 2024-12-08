import { Dropdown, Menu } from 'antd';
import PropTypes from 'prop-types';

const EllipsisDropdown = (props) => {
  const { propsEllipsisIcon = {}, ...otherProps } = props;
  return (
    // <Dropdown {...otherProps} trigger={["click"]}>
    //   <div className="ellipsis-dropdown">
    //     <EllipsisOutlined {...propsEllipsisIcon} />
    //   </div>
    // </Dropdown>
    <Dropdown {...otherProps} placement="bottomRight" getPopupContainer={(trigger) => trigger.parentNode}>
      <i className="gx-icon-btn icon icon-ellipse-v" />
    </Dropdown>
  );
};

EllipsisDropdown.propTypes = {
  trigger: PropTypes.string,
  placement: PropTypes.string,
  onClick: PropTypes.func,
  propsEllipsisIcon: PropTypes.object,
};

EllipsisDropdown.defaultProps = {
  trigger: 'click',
  placement: 'bottomRight',
  menu: <Menu />,
};

export default EllipsisDropdown;
