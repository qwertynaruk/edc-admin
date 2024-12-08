import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useEffect, useState } from 'react';

import { GOOGLE_MAP_API_KEY } from 'configs/AppConfig';
import { googleMapOptions } from 'constants/MapConstant';

const DEFAULT_HEIGHT = 250;

export const GoogleMapAddressPicker = ({ value, center, height = DEFAULT_HEIGHT }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
    language: 'th',
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(value ?? center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  useEffect(() => {
    if (map) {
      setTimeout(() => {
        map.setZoom(value ? 15 : 10);
      }, 1000);
    }
  }, [map]);

  useEffect(() => {
    if (map && value) {
      const { lat, lng } = value;
      map.setCenter({ lat, lng });
      // geocodeLatLng();
    }
  }, [value, map]);

  if (!isLoaded || (!value && !center)) return <></>;

  const containerStyle = {
    width: '100%',
    height: `${height}px`,
  };

  // function geocodeLatLng() {
  //   console.log('value', value);
  //   const geocoder = new google.maps.Geocoder();
  //   const latlng = new google.maps.LatLng(value?.lat, value?.lng);
  //   geocoder
  //     .geocode({
  //       location: latlng,
  //       // fulfillOnZeroResults: true,
  //     })
  //     .then((response) => {
  //       console.log(response);
  //     })
  //     .catch((error) => {
  //       console.log('error,', error);
  //     });
  // }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={googleMapOptions.default}
    >
      <>{value && <Marker position={value} />}</>
    </GoogleMap>
  );
};
