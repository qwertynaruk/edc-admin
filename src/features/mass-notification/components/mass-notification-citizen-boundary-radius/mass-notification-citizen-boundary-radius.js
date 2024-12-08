import { Card, Form, Slider, Typography } from 'antd';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useEffect, useRef, useState } from 'react';

import { GOOGLE_MAP_API_KEY } from '../../../../configs/AppConfig';
import { css } from '@emotion/css';

const containerStyle = {
  width: '100%',
  height: '570px',
};

const googleMapOptions = {
  rotateControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  zoomControl: false,
  mapTypeControl: false,
  mapTypeId: 'hybrid',
};

export const MassNotificationCitizenBoundaryRadius = ({
  radiusPosition = { radius: 0, locationMarker: undefined },
  setRadiusPosition = undefined,
}) => {
  const circleRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
    language: 'th',
  });

  const [map, setMap] = useState(null);

  const onMapChange = (e) => {
    const latLng = e.latLng?.toJSON();
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ location: e.latLng, language: 'th' }).then((response) => {
      const geocoder = response.results.find((ss) => ss.types.includes('locality'));
      setRadiusPosition({
        ...radiusPosition,
        locationMarker: {
          lat: latLng.lat,
          lng: latLng.lng,
        },
        address: geocoder.formatted_address,
      });
    });
  };

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(radiusPosition?.locationMarker);
    map.fitBounds(bounds);
    setMap(map);
    const latLngBound = new window.google.maps.LatLng(map.center);
    onMapChange({ latLng: latLngBound });
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  useEffect(() => {
    if (map) {
      const { locationMarker, radius } = radiusPosition;
      if (circleRef.current && radius !== 0) {
        circleRef.current.setMap(null);
      }

      const circle = new window.google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map,
        center: locationMarker,
        radius: radius * 1000,
      });

      circleRef.current = circle;
      map.fitBounds(circle.getBounds());
    }
  }, [map, radiusPosition]);

  return (
    <Card
      className={css`
        .ant-card-body {
          padding: 0;
        }
      `}
    >
      <Form
        layout="vertical"
        style={{
          padding: '24px 24px 12px 24px',
        }}
      >
        <Typography.Title level={4}>ขอบเขตพื้นที่การสื่อสาร</Typography.Title>
        <Form.Item label="รัศมี" name="radius" required>
          <RadiusSlider
            values={radiusPosition.radius}
            onChange={(value) => {
              setRadiusPosition({
                ...radiusPosition,
                radius: value,
              });
            }}
          />
        </Form.Item>
      </Form>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={radiusPosition?.locationMarker}
          zoom={15}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={googleMapOptions}
          onClick={onMapChange}
        >
          <Marker
            position={radiusPosition?.locationMarker}
            options={{
              icon: {
                url: '/img/icons/polygon_center.png',
                scaledSize: { width: 32, height: 32 },
              },
            }}
          />
        </GoogleMap>
      )}
    </Card>
  );
};

const RadiusSlider = ({ values, onChange }) => {
  return (
    <div
      className={css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 6px;
        position: relative;
      `}
    >
      <Typography.Text
        style={{
          position: 'absolute',
          fontSize: 16,
          top: 30,
          fontWeight: 'bold',
        }}
      >
        1
      </Typography.Text>
      <Slider
        min={1}
        max={100}
        value={values}
        defaultValue={values}
        onChange={onChange}
        tooltip={{
          open: true,
          // placement: 'bottom',
        }}
        style={{ flex: 1 }}
      />
      <Typography.Text
        style={{
          fontSize: 16,
        }}
      >
        กม.
      </Typography.Text>
      <Typography.Text
        style={{
          position: 'absolute',
          fontSize: 16,
          top: 30,
          fontWeight: 'bold',
          right: 20,
        }}
      >
        100
      </Typography.Text>
    </div>
  );
};
