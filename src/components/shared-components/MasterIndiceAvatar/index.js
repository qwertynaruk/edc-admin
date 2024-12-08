import { Avatar, Image } from 'antd';

const MasterIndiceAvatar = ({ size = 40, imageSource = '', category = 'default' }) => {
  const _dirImage = {
    default: 'default.png',
    person: 'personel.png',
    location: 'location.png',
    organization: 'organization.png',
    vehicle: 'vehicle.png',
    firearm: 'asset-gun.png',
    drug: 'asset-drug.png',
    other: 'asset-other.png',
    อาวุธ: 'asset-gun.png',
    ยาเสพติด: 'asset-drug.png',
    'อื่น ๆ': 'asset-other.png',
  };

  return (
    <Avatar
      size={size}
      icon={<Image src={imageSource || ''} preview={false} fallback={`/img/thumb-avatar/${_dirImage[category]}`} />}
    />
  );
};

export default MasterIndiceAvatar;
