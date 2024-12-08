import {
  BagCategoryIcon,
  CreditCardCategoryIcon,
  ElectronicsCategoryIcon,
  EyewearCategoryIcon,
  IdCardCategoryIcon,
  JewelryCategoryIcon,
  KeysCategoryIcon,
  OtherCategoryIcon,
  PhoneCategoryIcon,
  WalletCategoryIcon,
} from 'assets/svg';
import { Card, Space, Typography } from 'antd';

import styled from '@emotion/styled';

export function CategoryItems({ items = undefined, current = [], onClick = undefined }) {
  return (
    <CategoryCardComponent
      bodyStyle={{ padding: '24px 7px' }}
      current={!!current?.find((ss) => ss === items?.id)}
      onClick={onClick}
    >
      <Space direction="vertical" align="center" size={0}>
        <CategoryIcon typeName={items?.label_en} />
        <Typography.Text style={{ fontSize: 12 }}>{items?.label_en || 'undefined'}</Typography.Text>
      </Space>
    </CategoryCardComponent>
  );
}

export function CategoryIcon({ typeName = '', iconProps = { width: 21, height: 35 } }) {
  switch (typeName) {
    case 'Phone':
      return <PhoneCategoryIcon {...iconProps} />;

    case 'Wallet':
      return <WalletCategoryIcon {...iconProps} />;

    case 'ID Document':
      return <IdCardCategoryIcon {...iconProps} />;

    case 'Payment Card':
      return <CreditCardCategoryIcon {...iconProps} />;

    case 'Keys':
      return <KeysCategoryIcon {...iconProps} />;

    case 'Bag':
      return <BagCategoryIcon {...iconProps} />;

    case 'Electronics':
      return <ElectronicsCategoryIcon {...iconProps} />;

    case 'Eyewear':
      return <EyewearCategoryIcon {...iconProps} />;

    case 'Jewelry':
      return <JewelryCategoryIcon {...iconProps} />;

    default:
      return <OtherCategoryIcon {...iconProps} />;
  }
}

const CategoryCardComponent = styled(Card)(({ current }) => ({
  cursor: 'pointer',
  marginBottom: 0,
  transition: '0.5s all ease',
  ':hover': {
    boxShadow: '0 0 5px #cccccc2a',
  },
  backgroundColor: `${current ? '#111620' : '#1c2536'} !important`,
}));
