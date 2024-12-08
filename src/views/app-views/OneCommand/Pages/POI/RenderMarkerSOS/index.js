import { Marker } from '@react-google-maps/api';
import DialogNotification from 'components/shared-components/DialogNotification';
import { observer } from 'mobx-react';
import GisStore from 'mobx/GisStore';

const RenderMarkerSOS = ({ onFinishClick = () => {} }) => {
  const { geoCodeSOS = [] } = GisStore;

  if (geoCodeSOS.length <= 0) {
    return null;
  }

  const onClick = (position, _data) => {
    GisStore.getRedboxItemInfo(_data.id)
      .then(() => onFinishClick(position))
      .catch(() => DialogNotification('error', 'ขออภัย', 'ไม่สามารถเรียกข้อมูลนี้ได้'));
  };

  return geoCodeSOS.map((el, i) => (
    <Marker
      key={i}
      position={{
        lat: el.lat,
        lng: el.lng,
      }}
      options={{
        label: {
          color: '#fff',
          text: el.id,
          className: 'gx-mb-4 gx-pb-3',
        },
        icon: {
          url: '/img/marker-sos-icon.png',
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

export default observer(RenderMarkerSOS);
