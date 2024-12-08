import { Card } from 'antd';

const HeaderContent = (props) => {
  const { detailHeaderContent = '', propsHeaderContentCard = {}, ...otherProps } = props;

  return (
    <Card {...propsHeaderContentCard} {...otherProps}>
      {detailHeaderContent}
    </Card>
  );
};

export default HeaderContent;
