import { Input, Space, Typography } from 'antd';

import RxMap from 'components/shared-components/RxMap';

const center = {
  lat: 14.623331,
  lng: 100.383364,
};

export const CitizenCommunicationMap = ({ locationMarker = undefined, setLocationMarker = () => undefined }) => {
  const onMapChange = (e) => {
    setLocationMarker({
      locationMarker: {
        lat: e?.lat,
        lng: e?.lng,
      },
      addressTxt: e?.geoAddress,
    });
  };

  const googleMapOptions = {
    rotateControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeId: 'hybrid',
    zoomControlOptions: {
      position: window.google.maps.ControlPosition.RIGHT_TOP,
    },
  };

  return (
    <Space direction="vertical" size={15}>
      <RxMap
        setAddressMarker={onMapChange}
        center={locationMarker?.locationMarker || center}
        value={locationMarker?.locationMarker}
        options={googleMapOptions}
        enableSearch={false}
      />
      <Typography.Text>สถานที่</Typography.Text>
      <Input value={locationMarker?.addressTxt} readOnly />
    </Space>
  );
};
