import { Button, Card, Collapse, Input, Space, Spin, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import CheckBoxComplex from './CheckBoxComplex';
import FormCheckBox from './FormCheckBox';
import GisStore from 'mobx/GisStore';
import Guarded from 'components/shared-components/Guarded';
import { SearchOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { observer } from 'mobx-react';
import styled from '@emotion/styled';
import { toJS } from 'mobx';

const { Panel } = Collapse;

const MapFilterPanel = ({ frameHeight, setVisible, menuContentLoading }) => {
  const {
    pointOfInterestList = [],
    layerOverlayList = [],
    redboxList = [],
    partolList = [],
    CCTVList = [],
    ExternalCCTVList = [],
  } = GisStore;
  const [currentMenu, setCurrentMenu] = useState(['poi']);
  const [rawStore, setRawStore] = useState([]);
  const [mergeStore, setMergeStore] = useState([]);

  const [checkPOI, setCheckPOI] = useState(false);
  const [checkOverlay, setCheckOverlay] = useState(false);
  const [checkCCTV, setCheckCCTV] = useState(false);
  const [checkExternalCCTV, setCheckExternalCCTV] = useState([]);
  const [checkSOS, setCheckSOS] = useState(false);
  const [checkPartol, setCheckPartol] = useState(false);

  useEffect(() => {
    const _tx = toJS(pointOfInterestList).concat(
      toJS(layerOverlayList),
      toJS(
        redboxList.map((op) => ({
          lat: op.latitude,
          lng: op.longitude,
          group: 'sos',
          id: op.id,
          title: op.id,
        }))
      ),
      toJS(
        partolList.map((op) => ({
          lat: op.latitude,
          lng: op.longitude,
          group: 'partol',
          id: op.id,
          title: _.compact([op.prefix_name, op.first_name, op.last_name]).join(' ') || '-',
        }))
      ),
      toJS(
        CCTVList.map((op) => ({
          lat: op.location.coordinates[1],
          lng: op.location.coordinates[0],
          group: 'cctv',
          id: op._id,
          title: op.title,
        }))
      )
      // toJS(
      //   ExternalCCTVList.map((op) => ({
      //     lat: op.location.coordinates[1],
      //     lng: op.location.coordinates[0],
      //     group: 'cctv',
      //     id: op._id,
      //     title: op.title,
      //   }))
      // )
    );
    setMergeStore(_tx);
    setRawStore(_tx);
  }, [CCTVList, ExternalCCTVList, layerOverlayList, partolList, pointOfInterestList, redboxList]);

  const onSearchList = (values) => {
    const rawValues = values.target.value;
    const _tx = rawStore.filter((ss) => ss.title.toLowerCase().indexOf(rawValues.toLowerCase()) > -1);

    setMergeStore(_tx);
  };

  const onSelectPOIOption = (ss) => {
    const _tx = rawStore.filter((el) => ss.includes(el._id || el.id));
    GisStore.setGeoCodePoiList(_tx);
    setCheckPOI(ss);
  };

  const onSelectOverlayOption = (ss) => {
    const _tx = rawStore.filter((el) => ss.includes(el._id || el.id));
    GisStore.setGeoCodeOverlayList(_tx);
    setCheckOverlay(ss);
  };

  const onSelectCCTVOption = (ss) => {
    const _tx = rawStore.filter((el) => ss.includes(el._id || el.id));
    GisStore.setGeoCodeCCTVList(_tx);
    setCheckCCTV(ss);
  };

  const onSelectExternalCCTVOption = (ss, _key) => {
    const rawArrs = toJS(GisStore.ExternalCCTVList);
    const reduceArrs = _.map(rawArrs, (_items) => _items?.item);
    const _source = _.flatten(reduceArrs).filter((el) => ss.includes(el._id));

    const newSource = _.map(_source, (_items) => ({
      lat: _items.location.coordinates[1],
      lng: _items.location.coordinates[0],
      group: 'excctv',
      id: _items._id,
      title: _items.title,
    }));

    console.log(ss);

    GisStore.setGeoCodeExternalCCTVList(newSource);
    setCheckExternalCCTV(ss);
  };

  const onSelectSOSOption = (ss) => {
    const _tx = rawStore.filter((el) => ss.includes(el._id || el.id));
    GisStore.setGeoCodeSOSList(_tx);
    setCheckSOS(ss);
  };

  const onSelectPartolOption = (ss) => {
    const _tx = rawStore.filter((el) => ss.includes(el._id || el.id));
    GisStore.setGeoCodePartolList(_tx);
    setCheckPartol(ss);
  };

  const convertToSelector = (arrs = []) => {
    return arrs.map((ss) => ({
      label: ss?.title,
      value: ss?._id || ss?.id,
    }));
  };

  const poiList = useMemo(() => {
    return convertToSelector(mergeStore.filter((ss) => ss.group === 'จุดที่สนใจ'));
  }, [mergeStore]);

  const overlayList = useMemo(() => {
    return convertToSelector(mergeStore.filter((ss) => ss.group === 'ซ้อนทับแผนที่'));
  }, [mergeStore]);

  const cctvList = useMemo(() => {
    return convertToSelector(mergeStore.filter((ss) => ss.group === 'cctv'));
  }, [mergeStore]);

  const sosList = useMemo(() => {
    return convertToSelector(mergeStore.filter((ss) => ss.group === 'sos'));
  }, [mergeStore]);

  const partolPersonelList = useMemo(() => {
    return convertToSelector(mergeStore.filter((ss) => ss.group === 'partol'));
  }, [mergeStore]);

  return (
    <OffSidePanel
      frameHeight={frameHeight}
      title={
        <Space className="gx-full-width" direction="vertical" size={15}>
          <Space className="gx-full-width gx-space-between">
            <Typography.Text strong>ประเภทของข้อมูล</Typography.Text>
            <Guarded
              query={{
                group: 'One Command',
                type: 'GIS Dashboard',
                name: 'แก้ไขข้อมูล GIS Dashboard',
              }}
            >
              <Button type="primary" onClick={() => setVisible(true)}>
                เพิ่ม
              </Button>
            </Guarded>
          </Space>

          <Input prefix={<SearchOutlined className="gx-mr-2" />} placeholder="ค้นหา...." onChange={onSearchList} />
        </Space>
      }
    >
      <Spin spinning={menuContentLoading}>
        <Collapse
          className="gx-replace-collapse"
          defaultActiveKey={currentMenu}
          onChange={(el) => setCurrentMenu([el])}
        >
          <Panel header={`จุดที่สนใจ (${poiList.length})`} key="poi">
            <Space direction="vertical">
              {poiList.length <= 0 ? (
                <Typography.Text style={{ color: '#ffffff66' }}>ไม่พบรายการ</Typography.Text>
              ) : (
                <CheckBoxComplex
                  options={poiList}
                  checkedList={checkPOI}
                  onSelectOption={(_tx) => onSelectPOIOption(_tx)}
                />
              )}
            </Space>
          </Panel>

          <Panel header={`ซ้อนทับแผนที่ (${overlayList.length})`} key="overlay">
            <Space direction="vertical">
              {overlayList.length <= 0 ? (
                <Typography.Text style={{ color: '#ffffff66' }}>ไม่พบรายการ</Typography.Text>
              ) : (
                <CheckBoxComplex
                  options={overlayList}
                  checkedList={checkOverlay}
                  onSelectOption={(_tx) => onSelectOverlayOption(_tx)}
                />
              )}
            </Space>
          </Panel>

          <Panel header="พื้นที่เกิดเหตุ" key="incident_at">
            <Collapse className="gx-replace-collapse">
              <Panel header="แจ้งเบาะแส (4)" key="แจ้งเบาะแส">
                <FormCheckBox type="incident" />
              </Panel>
              <Panel header="รายงานการปฏิบัติหน้าที่ (4)" key="รายงานการปฏิบัติหน้าที่">
                <FormCheckBox type="onduty" />
              </Panel>
            </Collapse>
          </Panel>

          <Panel header="การเชื่อมต่อจากภายนอก" key="outside">
            <Collapse className="gx-replace-collapse">
              <Panel header={`CCTV (${cctvList.length})`} key="cctv">
                <Space direction="vertical">
                  {cctvList.length <= 0 ? (
                    <Typography.Text style={{ color: '#ffffff66' }}>ไม่พบรายการ</Typography.Text>
                  ) : (
                    <CheckBoxComplex
                      options={cctvList}
                      checkedList={checkCCTV}
                      onSelectOption={(_tx) => onSelectCCTVOption(_tx)}
                    />
                  )}
                </Space>
              </Panel>

              {ExternalCCTVList.map((ss, _index) => (
                <Panel header={`${ss?.type} (${_.get(ss, 'item', []).length})`} key={_index}>
                  <Space direction="vertical">
                    {_.get(ss, 'item', []).length <= 0 ? (
                      <Typography.Text style={{ color: '#ffffff66' }}>ไม่พบรายการ</Typography.Text>
                    ) : (
                      <CheckBoxComplex
                        options={_.map(_.get(ss, 'item', []), (_items) => ({
                          label: _items?.title,
                          value: _items?._id,
                        }))}
                        checkedList={checkExternalCCTV[_index]}
                        onSelectOption={(_tx) => onSelectExternalCCTVOption(_tx, _index)}
                      />
                    )}
                  </Space>
                </Panel>
              ))}

              <Panel header={`SOS (${sosList.length})`} key="sos">
                <Space direction="vertical">
                  {sosList.length <= 0 ? (
                    <Typography.Text style={{ color: '#ffffff66' }}>ไม่พบรายการ</Typography.Text>
                  ) : (
                    <CheckBoxComplex
                      options={sosList}
                      checkedList={checkSOS}
                      onSelectOption={(_tx) => onSelectSOSOption(_tx)}
                    />
                  )}
                </Space>
              </Panel>

              <Panel header={`เจ้าหน้าที่ (${partolPersonelList.length})`} key="partol">
                <Space direction="vertical">
                  {partolPersonelList.length <= 0 ? (
                    <Typography.Text style={{ color: '#ffffff66' }}>ไม่พบรายการ</Typography.Text>
                  ) : (
                    <CheckBoxComplex
                      options={partolPersonelList}
                      checkedList={checkPartol}
                      onSelectOption={(_tx) => onSelectPartolOption(_tx)}
                    />
                  )}
                </Space>
              </Panel>
            </Collapse>
          </Panel>
        </Collapse>
      </Spin>
    </OffSidePanel>
  );
};

export default observer(MapFilterPanel);

const OffSidePanel = styled(Card)`
  position: absolute !important;
  z-index: 10;
  top: 0;
  left: 0;
  width: 300px;
  height: 100%;

  .ant-card-body {
    overflow-y: scroll;
    height: 100%;
    padding: 5px;
    max-height: calc(${(props) => props.frameHeight}px - 80px);
  }
`;
