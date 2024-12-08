import { RollbackOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import PageBreadcrumb from 'components/layout-components/PageBreadcrumb';
import DataIndicesCategorySelectModal from 'components/shared-components/DataIndicesCategorySelectModal';
import { currentLocation, mapStyleMode } from 'constants/MapConstant';
import GisStore from 'mobx/GisStore';
import { useEffect, useState } from 'react';
import MapFilterPanel from '../../Components/MapFilterPanel';
import OnDutySchedule from '../../Components/Modal/OnDutySchedule';
import DrawableMap from './DrawableMap';

const libraries = ['places', 'drawing'];

export const trimTextDigitFL = (text = '') => {
  if (text.length > 0) {
    return [text.substring(0, 3), '...', text.substring(text.length - 3, text.length)].join('');
  }

  return '-';
};

const POI = () => {
  const [visible, setVisible] = useState(false);
  const [drawingModeEnable, setDrawingModeEnable] = useState(false);
  const [hiddenPanel, setHiddenPanel] = useState(false);
  const [menuContentLoading, setMenuContentLoading] = useState(false);
  const [controlType, setControlType] = useState('');
  const [onDutySchedule, setOnDutySchedule] = useState(false);

  const center = {};
  const frameHeight = window.outerHeight - 40;

  useEffect(() => {
    setMenuContentLoading(true);

    Promise.all([
      GisStore.getPointOfInterestList(),
      GisStore.getLayerOverlayList(),
      GisStore.getRedboxList(),
      GisStore.getCCTVList(),
      GisStore.getExternalCCTVList(),
      GisStore.getPartolList(),
    ]).finally(() => setMenuContentLoading(false));
  }, []);

  const handlesOk = (value) => {
    setControlType(value);
    setDrawingModeEnable(true);
    setVisible(false);
    setHiddenPanel(true);
    GisStore.clearGeoCodeList();
  };

  return (
    <>
      <PageBreadcrumb pageLabel={{ master: 'One Command', subpath: ['GIS'] }}>
        <Button ghost onClick={() => setOnDutySchedule(true)}>
          ตารางปฏิบัติหน้าที่
        </Button>
      </PageBreadcrumb>

      <Card>
        {!hiddenPanel && (
          <MapFilterPanel frameHeight={frameHeight} setVisible={setVisible} menuContentLoading={menuContentLoading} />
        )}

        {hiddenPanel && (
          <div style={{ position: 'absolute', top: 40, left: 40, zIndex: 15 }}>
            <Button onClick={() => setHiddenPanel(false)} icon={<RollbackOutlined />}>
              ย้อนกลับ
            </Button>
          </div>
        )}

        <DrawableMap
          libraries={libraries}
          frameHeight={frameHeight}
          currentLocation={currentLocation}
          mapStyleMode={mapStyleMode}
          center={center}
          controlType={controlType}
          hiddenPanel={hiddenPanel}
          setHiddenPanel={setHiddenPanel}
          drawingModeEnable={drawingModeEnable}
          setDrawingModeEnable={setDrawingModeEnable}
          setMenuContentLoading={setMenuContentLoading}
        />
      </Card>

      <DataIndicesCategorySelectModal
        visible={visible}
        actionState="map_gis"
        category={['point-of-interest', 'layer-overlay']}
        onOk={handlesOk}
        onCancel={() => setVisible(false)}
      />
      <OnDutySchedule visible={onDutySchedule} setVisible={(visible) => setOnDutySchedule(visible)} />
    </>
  );
};

export default POI;
