import styled from '@emotion/styled';
import { Tooltip, Typography } from 'antd';
const { Paragraph, Text } = Typography;

const LabelShowText = (props) => {
  const { labelText, value, layoutDirection = 'row', tooltip = null, ...otherProps } = props;

  return (
    <Paragraph {...otherProps}>
      <Text className="gx-mr-1 gx-text-level-0 label">{labelText} :</Text>
      <Text className="value">
        {tooltip ? (
          <Tooltip title={value} arrowPointAtCenter>
            {value || '-'}
          </Tooltip>
        ) : (
          value || '-'
        )}
      </Text>
    </Paragraph>
  );
};

export default LabelShowText;

const LabelTextStyle = styled.label`
  color: #ffffff;
  opacity: 0.4;
`;
