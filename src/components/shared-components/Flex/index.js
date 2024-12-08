import PropTypes from 'prop-types';

const Flex = (props) => {
  const { children, className, alignItems, justifyContent, mobileFlex, flexDirection } = props;
  const getFlexResponsive = () => (mobileFlex ? 'gx-d-flex' : 'gx-d-md-flex');
  return (
    <div
      className={`${getFlexResponsive()} ${className} ${flexDirection ? 'gx-flex-' + flexDirection : ''} ${
        alignItems ? 'gx-align-items-' + alignItems : ''
      } ${justifyContent ? 'gx-justify-content-' + justifyContent : ''}`}
    >
      {children}
    </div>
  );
};

Flex.propTypes = {
  className: PropTypes.string,
  alignItems: PropTypes.string,
  flexDirection: PropTypes.string,
  justifyContent: PropTypes.string,
  mobileFlex: PropTypes.bool,
};

Flex.defaultProps = {
  mobileFlex: true,
  flexDirection: 'row',
  className: '',
};

export default Flex;
