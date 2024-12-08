import { Card } from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import PropTypes from 'prop-types';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import IntlMessages from "util/IntlMessages";
import React from 'react';

const WYSISWYG = (props) => {
  const { onChange = () => {}, value, ...otherProps } = props;
  const WYSISWYGCustomStyle = hocCardStyleXysiswyg(Editor);
  return (
    <>
      <WYSISWYGCustomStyle editorState={value} onEditorStateChange={onChange} {...otherProps} />
    </>
  );
};
WYSISWYG.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onChange: PropTypes.func,
  value: PropTypes.object,
};
export default WYSISWYG;

const hocCardStyleXysiswyg = (Component) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    const { isCard = false, title = '', disabledTools = [], ...otherProps } = props;
    const mapToChangeName = React.useMemo(() => {
      const resp = disabledTools.map((name, index) => {
        if (disabledTools.length - 1 === index) {
          return `div.rdw-${name}-wrapper,`;
        }
        return `div.rdw-${name}-wrapper`;
      });
      return resp + '';
    }, [disabledTools]);

    return (
      <Card className="gx-card" title={title} hidden={isCard}>
        <Component
          editorStyle={{
            width: '100%',
            minHeight: 100,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: 'lightgray',
          }}
          {...otherProps}
        />
      </Card>
    );
  };
};
