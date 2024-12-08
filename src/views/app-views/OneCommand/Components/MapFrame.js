import { GoogleMap, Marker, Polygon, StandaloneSearchBox, useLoadScript } from '@react-google-maps/api';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import { Input } from 'antd';
import { PKEY_GOOGLE_MAPS } from 'constants/ApiConstant';
import _ from 'lodash';
import { mapStyleMode } from 'constants/MapConstant';
import styled from '@emotion/styled';

const currentTheme = 'dark';

const getPolygonsFromLatLng = (polygons) => {
  return polygons.map((polygon) => {
    const key = _.chain(polygon).flatMap(_.values).value().join(',');
    return <Polygon key={key} paths={polygon} />;
  });
};
const getPolygonsFromGISData = (gisData) => {
  return gisData.map((item) => {
    return <Polygon key={item._id} paths={item.geo_locations} />;
  });
};
const getPolygonsFromZoneAgent = (zoneAgent) => {
  if (Array.isArray(zoneAgent)) {
    return zoneAgent.map(getPolygonsFromZoneAgent);
  }
  const { zone } = zoneAgent;
  if (!zone) return null;
  const { gis_datas: gisData } = zone;
  if (!gisData) return null;
  return gisData.map((item) => {
    return (
      <Polygon
        key={zone._id}
        paths={item.geo_locations}
        onClick={() => {
          if (item.onClick) item.onClick();
        }}
      />
    );
  });
};

const defaultOptions = {
  searchBox: true,
  setMarkerPositionDisabled: false,
};

const MapFrame = (props) => {
  const { currentLocation, setAddressMarker, center = {}, frameHeight, options = defaultOptions } = props;
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: PKEY_GOOGLE_MAPS,
    libraries: ['places'],
  });
  const [Getbounds, Setbounds] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(props.markerPosition);
  const [GetsearchBox, SetsearchBox] = useState(null);
  const [Getsearchinput, Setsearchinput] = useState('');
  const [moveCurrentLocation, setMoveCurrentLocation] = useState(currentLocation);

  const onSBLoad = (ref) => {
    SetsearchBox(ref);
  };

  const onMapLoad = (map) => {
    // eslint-disable-next-line no-undef
    google.maps.event.addListener(map, 'bounds_changed', () => {
      Setbounds(map.getBounds());
    });
  };

  const setMarkers = (el) => {
    if (options.setMarkerPositionDisabled) return;
    // eslint-disable-next-line no-undef
    const geocoder = new google.maps.Geocoder();
    setMarkerPosition(el.latLng);

    geocoder.geocode({ location: el.latLng }).then((response) => {
      const ac_comps = response.results[0].address_components;
      setAddressMarker({
        address: ac_comps,
        lat: el.latLng.lat(),
        lng: el.latLng.lng(),
      });
    });
  };

  const onPlacesChanged = () => {
    const markerArray = [];
    const results = GetsearchBox.getPlaces();
    const place = results[0].geometry.location;

    place.address = results[0].formatted_address;
    markerArray.push(place);

    setMarkers({ latLng: markerArray[0] });

    setMoveCurrentLocation(markerArray[0]);
    Setsearchinput(markerArray[0].address);
  };

  useEffect(() => {
    const { lat = '', lng = '' } = center;
    if (lat && lng) {
      setMoveCurrentLocation({ lat, lng });
      setMarkerPosition({ lat, lng });
    }
  }, [center]);

  useEffect(() => {
    if (!props.markerPosition) return;
    setMarkerPosition(props.markerPosition);
  }, [props.markerPosition]);

  if (!isLoaded) return <LoadingOutlined />;

  return (
    <div style={{ position: 'relative' }}>
      {options.searchBox && (
        <SearchContainer>
          <StandaloneSearchBox onLoad={onSBLoad} onPlacesChanged={onPlacesChanged} bounds={Getbounds}>
            <Input
              onChange={(e) => Setsearchinput(e.target.value)}
              value={Getsearchinput}
              prefix={<SearchOutlined className="gx-mr-2" />}
              placeholder="ค้นหา...."
            />
          </StandaloneSearchBox>
        </SearchContainer>
      )}

      <GoogleMap
        center={moveCurrentLocation}
        zoom={13.3}
        onLoad={(map) => onMapLoad(map)}
        mapContainerStyle={{ height: frameHeight, width: '100%' }}
        libraries={['geometry', 'places']}
        options={mapStyleMode[currentTheme]}
        onClick={setMarkers}
      >
        {markerPosition && <Marker position={markerPosition} />}
        {props.polygons && getPolygonsFromLatLng(props.polygons)}
        {props.gisData && getPolygonsFromGISData(props.gisData)}
        {props.zoneAgent && getPolygonsFromZoneAgent(props.zoneAgent)}
      </GoogleMap>
    </div>
  );
};

export default MapFrame;

export const SearchContainer = styled.div`
  position: absolute;
  z-index: 15;
  width: 600px;
  left: calc((100% - 400px) / 2);
  top: 15px;
`;
