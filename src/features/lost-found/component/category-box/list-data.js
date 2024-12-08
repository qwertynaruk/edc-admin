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

const ListData = [
  {
    id: 'phone',
    icon: (props) => <PhoneCategoryIcon {...props} />,
    name: 'Phone',
  },
  {
    id: 'idcard',
    icon: (props) => <IdCardCategoryIcon {...props} />,
    name: 'ID card',
  },
  {
    id: 'atm',
    icon: (props) => <CreditCardCategoryIcon {...props} />,
    name: 'ATM',
  },
  {
    id: 'wallet',
    icon: (props) => <WalletCategoryIcon {...props} />,
    name: 'Wallet',
  },
  {
    id: 'jewelry',
    icon: (props) => <JewelryCategoryIcon {...props} />,
    name: 'Jewelry',
  },
  {
    id: 'eyewear',
    icon: (props) => <EyewearCategoryIcon {...props} />,
    name: 'Eyewear',
  },
  {
    id: 'key',
    icon: (props) => <KeysCategoryIcon {...props} />,
    name: 'Key',
  },
  {
    id: 'bags',
    icon: (props) => <BagCategoryIcon {...props} />,
    name: 'Bags',
  },
  {
    id: 'electronics',
    icon: (props) => <ElectronicsCategoryIcon {...props} />,
    name: 'Electronics',
  },
  {
    id: 'others',
    icon: (props) => <OtherCategoryIcon {...props} />,
    name: 'Others',
  },
];

export default ListData;
