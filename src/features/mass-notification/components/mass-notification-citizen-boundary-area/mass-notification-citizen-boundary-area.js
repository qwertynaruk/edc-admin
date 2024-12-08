import { Card, Form, Select, Typography } from 'antd';
import { GoogleMap, Polygon, useJsApiLoader } from '@react-google-maps/api';
import { first, flatten } from 'lodash';
import { useMemo, useState } from 'react';

import { GOOGLE_MAP_API_KEY } from '../../../../configs/AppConfig';
import citiesData from '../../../../assets/polygons/district.json';
import provinceData from '../../../../assets/polygons/province.json';

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

export const MassNotificationCitizenBoundaryArea = ({ mapCenter, setSelectedPolygon = undefined }) => {
  const [pickProvince, setPickProvince] = useState('');

  const provinces = provinceData?.map((ss) => ({
    label: ss?.properties?.ADM1_TH,
    value: ss?.properties?.ADM1_PCODE,
  }));

  const districtCities = citiesData?.map((ss) => ({
    label: ss?.properties?.ADM2_TH,
    value: ss?.properties?.ADM2_PCODE,
    motherCode: ss?.properties?.ADM1_PCODE,
    geometry: ss?.geometry,
  }));

  const [form] = Form.useForm();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
    language: 'th',
  });

  const [polygonPath, setPolygonPath] = useState([]);

  const complexGeometry = (loc) => {
    const geometry = loc?.geometry;
    try {
      if (geometry.type === 'MultiPolygon') {
        const coordinates = geometry?.coordinates;
        const x = flatten(coordinates);
        return x;
      }

      return geometry?.coordinates;
    } catch (error) {
      return [];
    }
  };

  const onFormChanges = (items) => {
    const polygonz = items?.polygon_ampures;
    const citiesAll = citiesData.filter((ss) => ss?.properties?.ADM1_PCODE === pickProvince);

    if (polygonz && polygonz.length > 0) {
      if (polygonz.includes('all')) {
        form.setFieldValue(
          'polygon_ampures',
          citiesAll.map((ss) => ss?.properties?.ADM2_PCODE)
        );
      }

      const filterCities = citiesData.filter((ss) => polygonz.includes(ss?.properties?.ADM2_PCODE));

      const pickItem = polygonz.includes('all') ? citiesAll : filterCities;
      const pickLatLng = pickItem.map(complexGeometry);
      const flatts = flatten(pickLatLng).map((ss) =>
        ss?.map((tx) => ({
          lat: tx[1],
          lng: tx[0],
        }))
      );

      setSelectedPolygon({
        provinceNameTh: first(pickItem)?.properties?.ADM1_TH || '',
        polygonPaths: pickItem.map((ss) => ss._id?.$oid),
      });

      setPolygonPath(flatts);
    } else {
      setPolygonPath([]);
    }
  };

  const cities = useMemo(() => {
    if (!pickProvince) {
      return [];
    }

    const pickCities = [
      {
        label: 'ทั้งหมด',
        value: 'all',
      },
    ].concat(districtCities.filter((ss) => ss.motherCode === pickProvince));

    return pickCities;
  }, [pickProvince]);

  return (
    <Card bodyStyle={{ padding: 0 }}>
      <Form
        form={form}
        layout="vertical"
        style={{
          padding: 24,
          paddingBottom: 12,
        }}
        onValuesChange={onFormChanges}
      >
        <Typography.Title level={4}>ขอบเขตพื้นที่การสื่อสาร</Typography.Title>
        <Form.Item name="polygon" label="พื้นที่การแจ้งเตือน จังหวัด" required>
          <Select
            showSearch
            allowClear
            options={provinces}
            onChange={(ss) => {
              form.setFieldValue('polygon_ampures', []);
              setPickProvince(ss);
            }}
          />
        </Form.Item>
        <Form.Item name="polygon_ampures" label="พื้นที่การแจ้งเตือน อำเภอ" required>
          <Select disabled={cities.length <= 0} allowClear showSearch mode="multiple" options={cities} />
        </Form.Item>
      </Form>

      {isLoaded && (
        <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={11} options={googleMapOptions}>
          <Polygon
            paths={polygonPath}
            options={{
              strokeColor: '#f2f2f2',
              strokeOpacity: '0.5',
              strokeWeight: '2',
              fillColor: '#E40608',
              fillOpacity: '0.45',
            }}
          />
        </GoogleMap>
      )}
    </Card>
  );
};
