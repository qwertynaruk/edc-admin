import { Marker } from '@react-google-maps/api';
import _ from 'lodash';
import { observer } from 'mobx-react';
import GisStore from 'mobx/GisStore';

const RenderMarkerPOI = ({ onFinishClick = () => {} }) => {
  const { geoCodePoiList = [] } = GisStore;

  if (geoCodePoiList.length <= 0 || geoCodePoiList.filter((ss) => ss.location).length <= 0) {
    return null;
  }

  const onClick = (position, data) => {
    onFinishClick(position, data);
  };

  return geoCodePoiList.map((el, i) => (
    <Marker
      key={i}
      position={{
        lat: el.location.coordinates[1],
        lng: el.location.coordinates[0],
      }}
      options={{
        label: {
          color: '#fff',
          text: el.title,
          className: 'gx-mb-4 gx-pb-3',
        },
        icon: {
          url: '/img/marker-poi-icon.png',
          scaledSize: { width: 32, height: 36 },
        },
      }}
      onClick={() => {
        const [lng, lat] = _.get(el, 'location.coordinates', []);
        onClick({ lat, lng }, el);
      }}
    />
  ));
};

export default observer(RenderMarkerPOI);
