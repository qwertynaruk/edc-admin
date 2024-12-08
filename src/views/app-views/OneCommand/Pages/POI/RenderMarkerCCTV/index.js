import { Marker } from '@react-google-maps/api';
import { observer } from 'mobx-react';
import GisStore from 'mobx/GisStore';

const RenderMarkerCCTV = ({ onFinishClick = () => {} }) => {
  const { geoCodeCCTV = [] } = GisStore;

  if (geoCodeCCTV.length <= 0) {
    return null;
  }

  const onClick = (position, _data) => {
    onFinishClick(position);
    GisStore.setCCTVItemInfo(_data);
  };

  return geoCodeCCTV.map((el, i) => (
    <Marker
      key={i}
      position={{
        lat: el.lat,
        lng: el.lng,
      }}
      options={{
        icon: {
          url: '/img/marker-cctv-on-icon.png',
          scaledSize: { width: 32, height: 36 },
        },
      }}
      onClick={() =>
        onClick(
          {
            lat: el.lat,
            lng: el.lng,
          },
          el
        )
      }
    />
  ));
};

export default observer(RenderMarkerCCTV);
