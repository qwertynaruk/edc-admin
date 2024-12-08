import { Marker } from '@react-google-maps/api';
import { observer } from 'mobx-react';
import GisStore from 'mobx/GisStore';
import { trimTextDigitFL } from '..';

const RenderMarkerOnduty = ({ onFinishClick = () => {} }) => {
  const { geoCodeOndutyList = [] } = GisStore;

  if (geoCodeOndutyList.length <= 0) {
    return null;
  }

  const onClick = (position, _data) => {
    onFinishClick(position, _data);
    GisStore.setMarkerType('onduty');
  };

  return geoCodeOndutyList.map((el, i) => (
    <Marker
      key={i}
      position={{
        lat: el.lat,
        lng: el.lng,
      }}
      options={{
        label: {
          color: '#fff',
          text: trimTextDigitFL(el.reportId),
          className: 'gx-mb-4 gx-pb-3',
        },
        icon: {
          url: '/img/marker-onduty-icon.png',
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

export default observer(RenderMarkerOnduty);
