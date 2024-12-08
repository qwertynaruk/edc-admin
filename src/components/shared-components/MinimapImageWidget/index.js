import { Image } from 'antd';
import { PKEY_GOOGLE_MAPS } from 'constants/ApiConstant';

const MinimapImageWidget = ({ originSource = {} }) => {
  const generateMinimapImage = () => {
    const { lat = '', latitude = '', lng = '', longitude = '' } = originSource;
    const newLatitude = latitude || lat;
    const newLongitude = longitude || lng;
    const geoLocate = [newLatitude, newLongitude].join(',');

    const groundParams = `center=${geoLocate}&zoom=12&size=100x100&scale=1&maptype=roadmap&key=${PKEY_GOOGLE_MAPS}`;
    const markerParams = `markers=size:mid|color:0xff3744|${geoLocate}`;

    return `https://maps.google.com/maps/api/staticmap?${groundParams}&${markerParams}`;
  };

  return <Image src={generateMinimapImage()} preview={false} fallback="/img/thumb-avatar/location.png" height={100} />;
};

export default MinimapImageWidget;
