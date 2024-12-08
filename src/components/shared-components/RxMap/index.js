import { currentLocation, mapStyleMode } from 'constants/MapConstant';

import { GOOGLE_MAP_API_KEY } from 'configs/AppConfig';
import { LoadingOutlined } from '@ant-design/icons';
import MapIframe from './map-iframe';
import { useLoadScript } from '@react-google-maps/api';

const libraries = ['geometry', 'places'];

const RxMap = (props) => {
  const { center = {} } = props;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
    language: 'th',
    libraries,
  });

  if (isLoaded) {
    return <MapIframe {...props} currentLocation={currentLocation} mapStyleMode={mapStyleMode} center={center} />;
  } else {
    return <LoadingOutlined />;
  }
};

export default RxMap;
