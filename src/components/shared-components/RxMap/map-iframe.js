import { GoogleMap, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

import { Input } from 'antd';

const currentTheme = 'dark';
const { Search } = Input;

const MapIframe = ({
  currentLocation,
  mapStyleMode,
  setAddressMarker,
  value,
  center,
  onChange,
  readOnly = false,
  options = undefined,
  enableSearch = true,
}) => {
  const google = window.google;

  const [Getbounds, Setbounds] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(value);
  const [GetsearchBox, SetsearchBox] = useState(null);
  const [Getsearchinput, Setsearchinput] = useState('');
  const [moveCurrentLocation, setMoveCurrentLocation] = useState(currentLocation);

  const onSBLoad = (ref) => {
    SetsearchBox(ref);
  };

  const onMapLoad = (map) => {
    google.maps.event.addListener(map, 'bounds_changed', () => {
      Setbounds(map.getBounds());
    });
  };

  const setMarkers = (el) => {
    if (readOnly) {
      return;
    }
    const geocoder = new google.maps.Geocoder();
    setMarkerPosition(el.latLng);

    geocoder.geocode({ location: el.latLng, language: 'th' }).then((response) => {
      const addressComponents = response.results[0].address_components;
      const geocoder = response.results.find((ss) => ss.types.includes('locality'));
      const forceAddress = geocoder?.formatted_address;

      const bkkAdress = () => {
        const bkkCoder = response.results.find((ss) => ss.types.includes('street_address'));
        if (!bkkCoder) {
          return forceAddress;
        }

        return bkkCoder?.formatted_address;
      };

      const payload = {
        address: addressComponents,
        geoAddress: forceAddress.includes('กรุงเทพมหานคร') ? bkkAdress() : forceAddress,
        lat: el.latLng.lat(),
        lng: el.latLng.lng(),
      };

      setAddressMarker(payload);
      if (onChange) onChange(payload);
    });
  };

  const onPlacesChanged = () => {
    try {
      const markerArray = [];
      const results = GetsearchBox.getPlaces();
      const place = results[0]?.geometry?.location;

      place.address = results[0].formatted_address;
      markerArray.push(place);

      setMarkers({ latLng: markerArray[0] });

      setMoveCurrentLocation(markerArray[0]);
      Setsearchinput(markerArray[0].address);
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const { lat, lng } = center;
    if (lat && lng) {
      const geocoder = new google.maps.Geocoder();
      const newPosition = new google.maps.LatLng({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      });

      setMoveCurrentLocation(newPosition);
      setMarkerPosition(newPosition);

      geocoder.geocode({ location: newPosition, language: 'th' }).then((response) => {
        const _address = response.results[0].address_components;
        setAddressMarker({
          address: _address,
          lat: newPosition.lat(),
          lng: newPosition.lng(),
        });
      });
    }
  }, []);

  return (
    <div className="gx-mt-3">
      {enableSearch && (
        <StandaloneSearchBox onLoad={onSBLoad} onPlacesChanged={onPlacesChanged} bounds={Getbounds}>
          <Search
            placeholder="ค้นหาสถานที่.."
            onChange={(e) => Setsearchinput(e.target.value)}
            value={Getsearchinput}
          />
        </StandaloneSearchBox>
      )}
      <div style={{ height: '400px', width: '100%', marginTop: 16 }}>
        <GoogleMap
          center={moveCurrentLocation}
          zoom={13.3}
          onLoad={(map) => onMapLoad(map)}
          mapContainerStyle={{ height: '400px', width: '100%' }}
          options={{
            ...options,
            styles: mapStyleMode[currentTheme]?.styles,
          }}
          onClick={setMarkers}
          clickableIcons={false}
        >
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
      </div>
    </div>
  );
};

export default MapIframe;
