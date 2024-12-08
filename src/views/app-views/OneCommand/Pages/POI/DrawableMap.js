import { Button, Card, Checkbox, Divider, Dropdown, Form, Input, Space, Spin, Typography } from 'antd';
import { DeleteOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import {
  DrawingManager,
  GoogleMap,
  InfoWindow,
  Marker,
  Polygon,
  StandaloneSearchBox,
  useLoadScript,
} from '@react-google-maps/api';
/* eslint-disable no-undef */
import { useEffect, useState } from 'react';

import A2O from 'utils/A2O';
import DialogNotification from 'components/shared-components/DialogNotification';
import GisStore from 'mobx/GisStore';
import Guarded from 'components/shared-components/Guarded';
import { Link } from 'react-router-dom';
import { ReactComponent as MapFilterIcon } from 'assets/images/map-filter-icon.svg';
import { PKEY_GOOGLE_MAPS } from 'constants/ApiConstant';
import RenderInfoWindow from './RenderInfoWindow';
import RenderMarkerCCTV from './RenderMarkerCCTV';
import RenderMarkerExternalCCTV from './RenderMarkerExternalCCTV';
import RenderMarkerIncident from './RenderMarkerIncident';
import RenderMarkerOnduty from './RenderMarkerOnduty';
import RenderMarkerPOI from './RenderMarkerPOI';
import RenderMarkerPartol from './RenderMarkerPartol';
import RenderMarkerSOS from './RenderMarkerSOS';
import _ from 'lodash';
import { locationZone } from 'constants/MapConstant';
import { observer } from 'mobx-react';
import styled from '@emotion/styled';

const currentTheme = 'dark';

const SearchContainer = styled.div`
  position: absolute;
  z-index: 15;
  width: 600px;
  left: calc((100% - 400px) / 2);
  top: 15px;
`;

const ButtonFilter = styled(Button)`
  position: absolute !important;
  right: 3em;
  z-index: 11;
  background-color: rgb(255, 255, 255) !important;
  line-height: unset !important;
  padding: 8px 5px !important;
  height: 40px !important;
  width: 40px;
  border: 0 !important;
  margin-top: 10px;
`;

const hiddenPlace = [
  {
    featureType: 'all',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];

const FilterPolygon = (props) => {
  const { filterList } = props;
  return (
    filterList.length &&
    filterList.map((el, i) => (
      <Polygon
        key={i}
        options={{
          fillColor: el.fillColor,
          fillOpacity: 0.4,
          strokeColor: '#000',
          strokeOpacity: 1,
          strokeWeight: 2,
        }}
        paths={el.paths}
      />
    ))
  );
};

const ForwardDisplayPolygon = (props) => {
  const { geoCodeList, onClick } = props;
  const _gx = geoCodeList.filter((ss) => ss.group === 'ซ้อนทับแผนที่');

  if (_gx.length <= 0 || _gx.filter((ss) => ss.location).length <= 0) {
    return null;
  }
  const newPath = (_current) => {
    const _cx = _.get(_current, 'location.coordinates', []);
    const _newCurrent = A2O.CHECK_ANY_ARRAY(_cx) ? _current?.location?.coordinates[0] : [];
    return _.map(_newCurrent, (ss) => ({ lng: ss[0], lat: ss[1] }));
  };

  return _gx.map((el, i) => (
    <Polygon
      key={i}
      options={{
        fillColor: el.fill_color,
        fillOpacity: 0.4,
        strokeColor: '#000',
        strokeOpacity: 1,
        strokeWeight: 2,
      }}
      paths={newPath(el)}
      onClick={() => onClick(newPath(el), el)}
    />
  ));
};

const DrawableMap = (props) => {
  const {
    libraries,
    currentLocation,
    mapStyleMode,
    frameHeight,
    controlType,
    hiddenPanel,
    drawingModeEnable,
    setDrawingModeEnable,
    setMenuContentLoading,
    setHiddenPanel,
  } = props;

  const [form] = Form.useForm();
  const { geoCodeOverlayList = [], geoCodePartol = [] } = GisStore;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: PKEY_GOOGLE_MAPS,
    libraries,
  });

  const [Getbounds, Setbounds] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [GetsearchBox, SetsearchBox] = useState(null);
  const [Getsearchinput, Setsearchinput] = useState('');

  const [colorChange, setColorChange] = useState('');
  const [addressContent, setAddressContent] = useState([]);
  const [itemId, setItemId] = useState('');
  const [itemData, setItemData] = useState({});
  const [formEvent, setFormEvent] = useState('create');
  const [patchControlType, setPatchControlType] = useState('point-of-interest');
  const [moveCurrentLocation, setMoveCurrentLocation] = useState(currentLocation);
  const [centerBounds, setCenterBounds] = useState({ lat: 0, lng: 0 });
  const [singlePosition, setSinglePosition] = useState({ lat: 0, lng: 0 });
  const [formLoading, setFormLoading] = useState(false);
  const [readyForm, setReadyForm] = useState(false);
  const [readyInfoView, setReadyInfoView] = useState(false);
  const [visibleInfoView, setVisibleInfoView] = useState(false);

  const [opMap, setOpMap] = useState();
  const [polygonLayerPaths, setPolygonLayerPaths] = useState([]);
  const [polygonFillColor, setPolygonFillColor] = useState('');
  const [checkedList, setCheckedList] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [filterList, setFilterList] = useState([]);

  useEffect(() => {
    onRandomColor();
  }, []);

  useEffect(() => {
    if (drawingModeEnable) {
      setReadyInfoView(false);
      setVisibleInfoView(false);
      setMarkerPosition(null);
    }
  }, [drawingModeEnable]);

  useEffect(() => {
    if (!hiddenPanel) {
      setDrawingModeEnable(false);
      onInfoWindowClose();
    }
  }, [hiddenPanel]);

  useEffect(() => {
    if (geoCodePartol.length > 0) {
      const interval = setInterval(() => {
        GisStore.getPartolList();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [geoCodePartol]);

  const onSBLoad = (ref) => {
    SetsearchBox(ref);
  };

  const onPlacesChanged = () => {
    const markerArray = [];
    const results = GetsearchBox.getPlaces();
    const place = results[0].geometry.location;

    place.address = results[0].formatted_address;
    markerArray.push(place);

    const center = _.get(results, '0.geometry.location')?.toJSON();
    if (center) {
      setCenterBounds(center);
      setMarkerPosition(center);
    }

    setMoveCurrentLocation(markerArray[0]);
    Setsearchinput(markerArray[0].address);
  };

  const onRandomColor = () => {
    const hexRandom = '#' + Math.floor(Math.random() * 16777215).toString(16);
    setColorChange(hexRandom);
  };

  const onMapLoad = (map) => {
    google.maps.event.addListener(map, 'bounds_changed', () => {
      Setbounds(map.getBounds());
    });

    setOpMap(map.data);
  };

  const onOverlayComplete = (ss) => {
    setOpMap(ss.overlay);
  };

  const getPolygonCenter = (paths) => {
    const bounds = new google.maps.LatLngBounds();
    const xPaths = paths.map((ss) => new google.maps.LatLng(ss.latitude || ss.lat, ss.longitude || ss.lng));

    for (let i = 0; i < xPaths.length; i++) {
      bounds.extend(xPaths[i]);
    }

    setCenterBounds(bounds.getCenter().toJSON());
    return bounds.getCenter().toJSON();
  };

  const onPolygonComplete = (event) => {
    setFormEvent('create');
    const polyArray = event.getPath().getArray();

    const paths = polyArray.map((ss) => ({ latitude: ss.lat(), longitude: ss.lng() }));
    paths.push(paths[0]);

    getPolygonCenter(paths);
    setPolygonLayerPaths(paths);
    setPolygonFillColor(event.fillColor);

    onRandomColor();
    setDrawingModeEnable(false);
    setReadyForm(true);
  };

  const onMarkerComplete = (event) => {
    setFormEvent('create');
    setReadyForm(false);

    const newPosition = new google.maps.LatLng(event.position);
    setSinglePosition(newPosition.toJSON());
    setCenterBounds(newPosition.toJSON());

    setDrawingModeEnable(false);
    setReadyForm(true);
  };

  const onInfoWindowClose = () => {
    opMap && opMap.setMap(null);
    form.resetFields();

    setReadyForm(false);
    setReadyInfoView(false);
    setMarkerPosition(null);
    setPolygonLayerPaths([]);
    setHiddenPanel(false);
  };

  const onFilterCheckAll = (ss) => {
    const _target = locationZone.map((vx) => vx.label);
    setCheckAll(ss.target.checked);

    if (ss.target.checked) {
      setCheckedList(_target);
      onFilterChange(_target);
    } else {
      setCheckedList(checkedList.filter((ss) => !_target.includes(ss)));
      onFilterChange(checkedList.filter((ss) => !_target.includes(ss)));
    }
  };

  const onFilterChange = (valueIds) => {
    setCheckedList(valueIds);
    setCheckAll(!(locationZone.length !== valueIds.length));

    const _tx = locationZone.filter((ss) => valueIds.includes(ss.label));
    const newPaths = _tx.map((ss) => ({
      paths: ss.polygon.map((ds) => ds.map((dss) => ({ lat: dss[0], lng: dss[1] }))),
      fillColor: ss.fillColor,
    }));

    setFilterList(newPaths);
  };

  const onMapGroundClick = (ss) => {
    if (!readyForm && !drawingModeEnable) {
      setCenterBounds(ss.latLng.toJSON());
      setReadyInfoView(true);

      const geocoder = new google.maps.Geocoder();
      setMarkerPosition(ss.latLng);
      geocoder.geocode({ location: ss.latLng, language: 'th' }).then((response) => {
        const addressLog = response.results[0].address_components;
        setAddressContent(addressLog);
      });

      setVisibleInfoView(false);
    }
  };

  const onPolygonClick = (paths, _data) => {
    setFormEvent('edit');
    setPatchControlType('layer-overlay');
    setItemId(_.get(_data, '_id', '-'));

    form.setFieldsValue({
      name: _.get(_data, 'title', '-'),
      description: _.get(_data, 'description', '-'),
    });

    getPolygonCenter(paths);
    setPolygonLayerPaths(_data?.geo_locations);
    setDrawingModeEnable(false);
    setReadyForm(true);
    setVisibleInfoView(false);
  };

  const onMarkerClick = (position, _data) => {
    setFormEvent('edit');
    setPatchControlType('point-of-interest');
    setItemId(_.get(_data, '_id', '-'));

    form.setFieldsValue({
      name: _.get(_data, 'title', '-'),
      description: _.get(_data, 'description', '-'),
    });

    const newPosition = new google.maps.LatLng(position);
    setSinglePosition(newPosition.toJSON());
    setCenterBounds(newPosition.toJSON());
    setDrawingModeEnable(false);

    setVisibleInfoView(false);
    setReadyInfoView(false);
    setReadyForm(true);
  };

  const onExtendMarkerClick = (position, _data = {}) => {
    const newPosition = new google.maps.LatLng(position);
    setItemData(_data);
    setCenterBounds(newPosition.toJSON());

    setVisibleInfoView(true);
    setReadyInfoView(false);
    setReadyForm(false);
  };

  const onFinishEvent = (values) => {
    setMenuContentLoading(true);
    setFormLoading(true);
    const { name = '', description = '' } = values;

    const payload = {
      'layer-overlay': {
        title: name,
        description,
        location: {
          type: 'Polygon',
          coordinates: [polygonLayerPaths.map((ss) => [ss.longitude || ss.lng, ss.latitude || ss.lat])],
        },
        fill_color: polygonFillColor,
        group: 'ซ้อนทับแผนที่',
        type: 'ทั่วไป',
      },
      'point-of-interest': {
        title: name,
        description,
        location: {
          type: 'Point',
          coordinates: [singlePosition?.lng, singlePosition?.lat],
        },
        group: 'จุดที่สนใจ',
        type: 'ทั่วไป',
      },
    };

    if (formEvent === 'create') {
      GisStore.createPaths(payload[controlType])
        .then(() => {
          setDrawingModeEnable(false);
          onInfoWindowClose();
        })
        .finally(() => {
          setMenuContentLoading(false);
          setFormLoading(false);
        });
    } else {
      GisStore.updatePaths(payload[patchControlType], itemId)
        .then(() => {
          setDrawingModeEnable(false);
          onInfoWindowClose();
        })
        .finally(() => {
          setMenuContentLoading(false);
          setFormLoading(false);
        });
    }
  };

  const onDeleteItems = () => {
    setFormLoading(true);
    GisStore.deletePaths(itemId)
      .then(() => {
        setDrawingModeEnable(false);
        onInfoWindowClose();
      })
      .finally(() => {
        setMenuContentLoading(false);
        setFormLoading(false);
      });
  };

  const newAddressContent = addressContent
    .filter((tx) => !tx.types.includes('plus_code'))
    .map((ss) => ss.long_name)
    .join(' ');

  if (!isLoaded) return <LoadingOutlined />;

  return (
    <div style={{ position: 'relative' }}>
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

      <Dropdown
        overlay={
          <Card bodyStyle={{ padding: 5 }}>
            <Space direction="vertical">
              <Checkbox onChange={onFilterCheckAll} checked={checkAll}>
                แสดงเขตตรวจ
              </Checkbox>
              <Checkbox.Group
                options={locationZone.map((vx) => ({ label: vx.label, value: vx.label }))}
                value={checkedList}
                onChange={onFilterChange}
                style={{ display: 'flex', flexDirection: 'column', lineHeight: 2 }}
              />
            </Space>
          </Card>
        }
      >
        <ButtonFilter>
          <MapFilterIcon />
        </ButtonFilter>
      </Dropdown>

      <GoogleMap
        key={'drawable-map'}
        center={moveCurrentLocation}
        zoom={13.3}
        onLoad={(map) => onMapLoad(map)}
        mapContainerStyle={{ height: frameHeight, width: '100%' }}
        options={{ styles: mapStyleMode[currentTheme].styles.concat(hiddenPlace) }}
        onClick={onMapGroundClick}
        mapContainerClassName="gx-poi-map"
      >
        {drawingModeEnable && (
          <DrawingManager
            onPolygonComplete={onPolygonComplete}
            onMarkerComplete={onMarkerComplete}
            onOverlayComplete={onOverlayComplete}
            options={{
              drawingControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP,
                drawingModes: [
                  controlType === 'layer-overlay'
                    ? google.maps.drawing.OverlayType.POLYGON
                    : google.maps.drawing.OverlayType.MARKER,
                ],
              },
              polygonOptions: {
                fillColor: colorChange,
              },
            }}
          />
        )}

        {readyForm && (
          <InfoWindow position={centerBounds} onCloseClick={onInfoWindowClose}>
            <Card
              style={{ width: 400, height: 250, marginBottom: 16, marginRight: 16 }}
              bordered={false}
              bodyStyle={{ padding: 5 }}
            >
              <Space className="gx-full-width gx-space-between">
                <Typography.Text>ข้อมูลตำแหน่งบนแผนที่</Typography.Text>
                <Guarded
                  query={{
                    group: 'One Command',
                    type: 'GIS Dashboard',
                    name: 'แก้ไขข้อมูล GIS Dashboard',
                  }}
                >
                  <Button type="primary">
                    <Link
                      to={`/app/incident-management/report/onduty/create?lat=${centerBounds.lat}&lng=${centerBounds.lng}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      สั่งการ
                    </Link>
                  </Button>
                </Guarded>
              </Space>
              <Divider />
              <Spin spinning={formLoading}>
                <Form
                  layout="vertical"
                  form={form}
                  onFinishFailed={() => DialogNotification('warning', 'ไม่สามารถทำรายการได้', 'กรุณากรอกข้อมูลให้ครบ')}
                  onFinish={onFinishEvent}
                >
                  <Form.Item name="name" label="" rules={[{ required: true, message: 'กรุณากรอกชื่อพื้นที่' }]}>
                    <Input placeholder="กรอกชื่อพื้นที่" />
                  </Form.Item>

                  <Form.Item name="description" label="">
                    <Input.TextArea placeholder="กรอกคำอธิบาย" rows={3} />
                  </Form.Item>
                </Form>

                <Guarded
                  query={{
                    group: 'One Command',
                    type: 'GIS Dashboard',
                    name: 'แก้ไขข้อมูล GIS Dashboard',
                  }}
                >
                  <Space className={`gx-full-width ${formEvent === 'edit' ? 'gx-space-between' : 'gx-flex-end'}`}>
                    {formEvent === 'edit' && (
                      <Button icon={<DeleteOutlined />} onClick={onDeleteItems}>
                        ลบ
                      </Button>
                    )}
                    <Space>
                      <Button onClick={onInfoWindowClose}>ยกเลิก</Button>
                      <Button loading={formLoading} type="primary" onClick={() => form.submit()}>
                        บันทึก
                      </Button>
                    </Space>
                  </Space>
                </Guarded>
              </Spin>
            </Card>
          </InfoWindow>
        )}

        {readyInfoView && (
          <InfoWindow position={centerBounds} onCloseClick={onInfoWindowClose}>
            <Card
              style={{ width: 340, height: 140, marginBottom: 16, marginRight: 16 }}
              bordered={false}
              bodyStyle={{ padding: 5 }}
            >
              <Space direction="vertical">
                <Space className="gx-full-width gx-space-between">
                  <Typography.Text>ข้อมูลตำแหน่งบนแผนที่</Typography.Text>
                  <Guarded
                    query={{
                      group: 'One Command',
                      type: 'GIS Dashboard',
                      name: 'แก้ไขข้อมูล GIS Dashboard',
                    }}
                  >
                    <Button type="primary">
                      <Link
                        to={`/app/incident-management/report/onduty/create?lat=${centerBounds.lat}&lng=${centerBounds.lng}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        สั่งการ
                      </Link>
                    </Button>
                  </Guarded>
                </Space>

                <Divider />

                <Typography.Text>{addressContent.length > 0 ? newAddressContent : ''}</Typography.Text>

                <Space>
                  <Typography.Text style={{ color: '#ffffff66' }}>พิกัด :</Typography.Text>
                  <Typography.Text>
                    {centerBounds.lat}, {centerBounds.lng}
                  </Typography.Text>
                </Space>
              </Space>
            </Card>
          </InfoWindow>
        )}

        {markerPosition && <Marker position={markerPosition} />}

        <FilterPolygon filterList={filterList} />

        {geoCodeOverlayList.length > 0 && (
          <ForwardDisplayPolygon geoCodeList={geoCodeOverlayList} onClick={onPolygonClick} />
        )}

        <RenderInfoWindow
          visible={visibleInfoView}
          centerBounds={centerBounds}
          itemData={itemData}
          onInfoWindowClose={() => setVisibleInfoView(false)}
        />

        <RenderMarkerPOI onFinishClick={onMarkerClick} />
        <RenderMarkerSOS onFinishClick={onExtendMarkerClick} />
        <RenderMarkerOnduty onFinishClick={onExtendMarkerClick} />
        <RenderMarkerIncident onFinishClick={onExtendMarkerClick} />
        <RenderMarkerCCTV onFinishClick={onExtendMarkerClick} />
        <RenderMarkerExternalCCTV onFinishClick={onExtendMarkerClick} />
        <RenderMarkerPartol onFinishClick={onExtendMarkerClick} />
      </GoogleMap>
    </div>
  );
};

export default observer(DrawableMap);
