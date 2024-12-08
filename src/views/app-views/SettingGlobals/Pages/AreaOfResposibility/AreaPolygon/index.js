import { Button, Col, Input, Row, Spin, Tree } from 'antd';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { centerGoogleMap, googleMapOptions } from 'constants/MapConstant';
import { useCallback, useEffect, useMemo, useState } from 'react';

import DialogNotification from 'components/shared-components/DialogNotification';
import { FIX_FIND_REDIRECT_PATH_SUCCESS } from 'constants/OrganizationConstant';
import { GOOGLE_MAP_API_KEY } from 'configs/AppConfig';
import Guarded from 'components/shared-components/Guarded';
import PersonnelService from 'services/PersonelService';
import UserStore from 'mobx/UserStore';
import _ from 'lodash';
import districtData from '../../../../../../assets/polygons/district.json';
import fetch from 'axios/FetchMaster';
import { findTitleByText } from 'utils/findChildren';
import provinceData from '../../../../../../assets/polygons/province.json';
import { sanitizeService } from 'utils/serviceHelper';
import subdistrictData from '../../../../../../assets/polygons/subdistrict.json';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const personnel = sanitizeService(fetch.personnel);

const adminService = sanitizeService(fetch.system_admin);

const containerStyle = {
  width: '100%',
  height: '570px',
};

const defaultOption = {
  defaultColor: '#f2f2f2',
  strokeColor: '#f2f2f2',
  strokeOpacity: '0.5',
  strokeWeight: '2',
  color: '#E40608',
  fillOpacity: '0.45',
};

const AreaPolygonPage = ({ organizationID = null, view = false }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
    language: 'th',
  });
  const { organization } = UserStore;

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [map, setMap] = useState(null);
  const [selectTreeData, setSelectTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [loaddingUpdate, setLoaddingUpdate] = useState(false);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const navigate = useNavigate();

  // const { data: dataProvinces, isLoading } = useGetThaiMapsAreaLists({
  //   queryParams: { provinces: '', page: 1, limit: 9999 },
  // });

  const { data: dataPolygonOrg, isLoading } = PersonnelService.useGetOrgnanizationById({
    // queryParams: { _id: organization?._id },
    queryParams: { _id: organizationID },
    view,
  });

  const mutationGetPolygon = useMutation({
    mutationFn: async (playload) => {
      return await adminService({
        method: 'POST',
        url: '/geographies/with_array',
        data: playload,
      });
    },
  });

  // const { mutateAsync, isPending: isPendingUpdate } = useMutation({
  //   mutationFn: async (body) => {
  //     await personnel({
  //       method: 'PUT',
  //       // url: `/organization_info?_id=${body?.id}`,
  //       url: `/organization_info/polygon?_id=${body?.id}`,
  //       data: body?.payload,
  //     });
  //   },
  //   onSuccess() {
  //     DialogNotification('success', 'อัปเดตข้อมูลสำเร็จ');
  //     setLoaddingUpdate(false);
  //   },
  //   onError(value) {
  //     DialogNotification('error', 'อัปเดตรายการไม่สำเร็จ');
  //     setLoaddingUpdate(false);
  //   },
  // });

  function mapDataAll(provinceList = [], districtList = [], subdistrictList = [], allData = false) {
    let outPutList = provinceList.map((rowProvince) => {
      const idProvince = rowProvince?._id?.$oid;
      const findDistrict = districtList
        .filter((rd) => rd.properties.ADM1_PCODE === rowProvince.properties.ADM1_PCODE)
        .map((rowDistrict) => {
          const idDistrict = rowDistrict?._id?.$oid;
          const findSubDistrict = subdistrictList
            .filter((rd) => rd.properties.ADM2_PCODE === rowDistrict.properties.ADM2_PCODE)
            .map((rowSubDistrict) => {
              const idSubDistrict = rowSubDistrict?._id?.$oid;
              const checkLvSubDistrict = checkLevel(rowSubDistrict?.properties);

              if (allData) {
                return {
                  ...rowSubDistrict,
                  id: idSubDistrict,
                  idProvince,
                  idDistrict,
                  key: checkLvSubDistrict.code,
                  title: checkLvSubDistrict.title,
                };
              } else {
                return {
                  id: idSubDistrict,
                  idProvince,
                  idDistrict,
                  key: checkLvSubDistrict.code,
                  title: checkLvSubDistrict.title,
                };
              }
            });
          if (!_.isEmpty(findSubDistrict)) {
            rowDistrict.children = findSubDistrict;
          }
          const checkLvDistrict = checkLevel(rowDistrict?.properties);
          if (allData) {
            return {
              ...rowDistrict,
              id: idDistrict,
              idProvince,
              key: checkLvDistrict.code,
              title: checkLvDistrict.title,
            };
          } else {
            return {
              id: idDistrict,
              idProvince,
              key: checkLvDistrict.code,
              title: checkLvDistrict.title,
            };
          }
        });
      if (!_.isEmpty(findDistrict)) {
        rowProvince.children = findDistrict;
      }
      const checkLv = checkLevel(rowProvince?.properties);
      if (allData) {
        return {
          ...rowProvince,
          id: idProvince,
          key: checkLv.code,
          title: checkLv.title,
        };
      } else {
        return {
          id: idProvince,
          key: checkLv.code,
          title: checkLv.title,
        };
      }
    });

    outPutList = outPutList.sort((a, b) => {
      const aa = a.key.split('TH');
      const bb = b.key.split('TH');
      return Number(aa[1]) - Number(bb[1]);
    });

    return outPutList;
  }

  const provinceList = useMemo(() => {
    if (!_.isEmpty(provinceData) && !_.isEmpty(districtData) && !_.isEmpty(subdistrictData)) {
      const tmpData = mapDataAll(provinceData, districtData, subdistrictData, true);
      return tmpData;
    } else {
      return [];
    }
  }, []);

  useEffect(() => {
    const filterData = {
      geo_provinces: { _id: [] },
      geo_amphures: { _id: [] },
      geo_districts: { _id: [] },
    };

    if (map) {
      map?.data?.forEach((feature) => {
        map?.data?.remove(feature);
      });
      if (!_.isEmpty(dataPolygonOrg?.polygons)) {
        setDefaultDataV2(dataPolygonOrg?.polygons);
      }
    }

    // dataPolygonOrg?.polygons.forEach((rd) => {
    //   if (filterData[rd.type]) {
    //     filterData[rd.type]._id.push(rd._id);
    //   } else {
    //     filterData[rd?.type] = {
    //       _id: [rd._id],
    //     };
    //   }
    // });
    // if (!_.isEmpty(filterData)) {
    //   // mutationGetPolygon.mutateAsync(filterData);
    // }
  }, [dataPolygonOrg?.polygons, map]);

  const setDefaultData = (dataObj = {}) => {
    const listDefaultData = [];
    if (!_.isEmpty(dataObj?.geo_provinces)) {
      const dataList = dataObj?.geo_provinces.map((rowData) => {
        const checkProperties = checkLevel(rowData?.properties);
        const findSubDistrictPolygon = provinceList
          .find((pv) => pv.key === checkProperties?.code)
          ?.children?.find((ds) => ds.key === checkProperties.districtCode)?.children;
        // console.log('findSubDistrictPolygon', findSubDistrictPolygon);
        // if (!_.isEmpty(findSubDistrictPolygon)) {
        //   if (!listDefaultData.find((rd) => rd.key === checkProperties.code)) {
        //     listDefaultData.push(...findSubDistrictPolygon);
        //   }
        //   map?.data?.addGeoJson({
        //     type: 'FeatureCollection',
        //     features: findSubDistrictPolygon,
        //   });
        // }
        return checkProperties?.code;
      });
      setCheckedKeys([...checkedKeys, ...dataList]);
    }
    if (!_.isEmpty(dataObj?.geo_amphures)) {
      const dataList = dataObj?.geo_amphures.map((rowData) => {
        const checkProperties = checkLevel(rowData?.properties);
        const findSubDistrictPolygon = provinceList
          .find((pv) => pv.key === checkProperties?.provinceCode)
          ?.children?.find((ds) => ds.key === checkProperties.code)?.children;
        if (!_.isEmpty(findSubDistrictPolygon)) {
          listDefaultData.push(...findSubDistrictPolygon);
          map?.data?.addGeoJson({
            type: 'FeatureCollection',
            features: findSubDistrictPolygon,
          });
        }
        return checkProperties?.code;
      });
      setCheckedKeys([...checkedKeys, ...dataList]);
    }
    if (!_.isEmpty(dataObj?.geo_districts)) {
      const dataList = dataObj?.geo_districts.map((rowData) => {
        const checkProperties = checkLevel(rowData?.properties);
        const findSubDistrictPolygon = provinceList
          .find((pv) => pv.key === checkProperties?.provinceCode)
          ?.children?.find((ds) => ds.key === checkProperties.districtCode)
          ?.children?.find((ds) => ds.key === checkProperties.code);

        console.log('findSubDistrictPolygon', findSubDistrictPolygon);

        if (!_.isEmpty(findSubDistrictPolygon)) {
          if (!listDefaultData.find((rd) => rd.key === checkProperties.code)) {
            listDefaultData.push(...findSubDistrictPolygon);
          }
          map?.data?.addGeoJson({
            type: 'FeatureCollection',
            features: findSubDistrictPolygon,
          });
        }
        return checkProperties?.code;
      });
      setCheckedKeys([...checkedKeys, ...dataList]);
    }
    setSelectTreeData(listDefaultData);
  };

  const setDefaultDataV2 = (dataObj = []) => {
    const listDefaultData = [];
    const listChecked = [];

    dataObj.forEach((rowData) => {
      if (rowData?.type === 'geo_districts') {
        const findSubDistrict = subdistrictData.find((sd) => sd?._id?.$oid === rowData?._id);
        if (findSubDistrict) {
          const checkProperties = checkLevel(findSubDistrict?.properties);
          const findSubDistrictPolygon = provinceList
            .find((pv) => pv.key === checkProperties?.provinceCode)
            ?.children?.find((ds) => ds.key === checkProperties.districtCode)
            ?.children?.find((ds) => ds.key === checkProperties.code);

          console.log('findSubDistrictPolygon', findSubDistrictPolygon);

          if (!_.isEmpty(findSubDistrictPolygon)) {
            if (!listDefaultData.find((rd) => rd.key === checkProperties.code)) {
              listDefaultData.push(findSubDistrictPolygon);
            }
            map?.data?.addGeoJson({
              type: 'FeatureCollection',
              features: [findSubDistrictPolygon],
            });
          }
          listChecked.push(checkProperties?.code);
        }
      }
    });
    setSelectTreeData(listDefaultData);
    setCheckedKeys(listChecked);
  };

  useEffect(() => {
    if (!_.isEmpty(mutationGetPolygon?.data?.response) && !_.isEmpty(provinceList)) {
      setDefaultData(mutationGetPolygon?.data?.response);
    }
  }, [mutationGetPolygon?.data?.response]);

  function checkLevel(properties = {}, findAll = true) {
    const checkData = {
      level: null,
      code: null,
      title: null,
      provinceId: null,
      provinceCode: null,
      districtId: null,
      districtCode: null,
      subDistrictId: null,
      subDistrictCode: null,
    };
    if (!_.isEmpty(properties)) {
      if (properties?.ADM3_PCODE && properties?.ADM2_PCODE && properties?.ADM1_PCODE) {
        checkData.level = 3;
        checkData.code = properties?.ADM3_PCODE;
        checkData.provinceCode = properties?.ADM1_PCODE;
        checkData.districtCode = properties?.ADM2_PCODE;
        checkData.title = properties?.ADM3_TH;
        if (findAll) {
          const findProvinceData = provinceData.find((pv) => pv?.properties?.ADM1_PCODE === properties?.ADM1_PCODE);
          checkData.provinceId = findProvinceData?._id?.$oid;
          const findDistrictData = districtData.find((pv) => pv?.properties?.ADM2_PCODE === properties?.ADM2_PCODE);
          checkData.districtId = findDistrictData?._id?.$oid;
        }
      } else if (!properties?.ADM3_PCODE && properties?.ADM2_PCODE && properties?.ADM1_PCODE) {
        checkData.level = 2;
        checkData.code = properties?.ADM2_PCODE;
        checkData.provinceCode = properties?.ADM1_PCODE;
        checkData.title = properties?.ADM2_TH;
        if (findAll) {
          const findProvinceData = provinceData.find((pv) => pv?.properties?.ADM1_PCODE === properties?.ADM1_PCODE);
          checkData.provinceId = findProvinceData?._id?.$oid;
        }
      } else if (!properties?.ADM3_PCODE && !properties?.ADM2_PCODE && properties?.ADM1_PCODE) {
        checkData.level = 1;
        checkData.code = properties?.ADM1_PCODE;
        checkData.title = properties?.ADM1_TH;
      }
    }
    return checkData;
  }

  const onCheck = async (selectedKeys, info) => {
    setCheckedKeys(selectedKeys);
    const checkProperties = checkLevel(info?.node?.properties);
    // const featureData = map.data.getFeatureById(info?.node?.id);
    setSelectTreeData(info?.checkedNodes);
    // remove old polygon
    map?.data?.forEach((feature) => {
      const checkRowData = checkLevel(feature.Fg);
      if (
        ((checkProperties.level === 1 && !selectedKeys.includes(feature.getProperty('ADM1_PCODE'))) ||
          (checkProperties.level === 2 && !selectedKeys.includes(feature.getProperty('ADM2_PCODE'))) ||
          (checkProperties.level === 3 && !selectedKeys.includes(feature.getProperty('ADM3_PCODE')))) &&
        !selectedKeys.includes(checkRowData.code)
      ) {
        map?.data?.remove(feature);
      }
    });

    if (!_.isEmpty(info?.checkedNodes)) {
      // เหลื่อทำวาด พื้นหลังจังหวัด
      // const featureProvinceData = map?.data?.getFeatureById(info?.node?.idProvince);
      // console.log('featureProvinceData', featureProvinceData);
      // if (!featureProvinceData) {
      //   console.log('province', provinceList);
      //   const findProvinceData = provinceList.find((rp) => checkProperties.level === 1 && rp.id === info?.node?.id);
      //   if (findProvinceData) {
      //     findProvinceData.properties.isColorful = true;
      //     console.log('findProvinceData', findProvinceData);
      //     map?.data?.addGeoJson({
      //       type: 'FeatureCollection',
      //       features: [findProvinceData],
      //     });
      //   }
      // }

      // const centerMapData = parseInt(info?.node?.geometry?.coordinates?.length / 2);
      // const getCenterMap = info?.node?.geometry?.coordinates?.[centerMapData]?.geometry?.coordinates?.[0];
      // const pointCenter = getCenterMap?.[parseInt(getCenterMap.length / 2)];

      // if (pointCenter?.[1] && pointCenter?.[0]) {
      //   await map.setCenter({ lat: pointCenter[1], lng: pointCenter[0] });
      //   await map.setZoom(9);
      // }
      info?.checkedNodes.forEach((checked) => {
        const checkedLevel = checkLevel(checked?.properties);
        const featureData = map?.data?.getFeatureById(checked?.id);
        if (info.checked) {
          if (checkedLevel.level === 3 && info.checked) {
            if (!featureData) {
              map?.data?.addGeoJson({
                type: 'FeatureCollection',
                features: [checked],
              });
            }
          }
        } else {
          if (featureData) {
            if (checkProperties.level === 1 && checkProperties.code === checked?.properties?.ADM1_PCODE) {
              map?.data?.remove(featureData);
            }
          }
        }
      });
    } else {
      map.data.forEach((feature) => {
        map?.data?.remove(feature);
      });
    }
  };

  const onExpand = async (info) => {
    setExpandedKeys(info);
    setAutoExpandParent(false);
  };

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const onLoad = useCallback(function callback(map) {
    setMap(map);

    map.data.setStyle((feature) => {
      // let color = '';
      // if (feature.getProperty('isColorful')) {
      //   color = defaultOption.color;
      // }
      return /** @type {!google.maps.Data.StyleOptions} */ {
        strokeColor: defaultOption.strokeColor,
        strokeOpacity: '0.5',
        strokeWeight: '2',
        fillOpacity: '0.2',
        fillColor: defaultOption.color,
      };
    });
  }, []);

  const onSearch = (value) => {
    if (value) {
      const findData = findTitleByText(provinceList, value);
      setExpandedKeys(findData);
      setSearchValue(value);
      setAutoExpandParent(true);
    } else {
      setAutoExpandParent(false);
      setSearchValue('');
      setExpandedKeys([]);
    }
  };

  const treeCustomData = useMemo(() => {
    const loop = (data) =>
      data.map((item) => {
        const strTitle = item.title;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#fa8c16' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return {
            ...item,
            title,
            key: item.key,
            children: loop(item.children),
          };
        }
        return {
          ...item,
          title,
          key: item.key,
        };
      });
    return loop(provinceList);
  }, [searchValue]);

  const onSubmitPolygon = async () => {
    if (!_.isEmpty(selectTreeData)) {
      setLoaddingUpdate(true);
      const filterData = {
        provinces: [],
        amphures: [],
        districts: [],
        idList: [],
      };

      console.log('selectTreeData', selectTreeData);

      const cutSize = 200;
      selectTreeData.forEach((rowData) => {
        filterData.idList.push(rowData?.id);
        if (!rowData?.idProvince && !rowData?.idDistrict && rowData?.id) {
          // filterData.provinces.push(rowData?.key);
          // filterData.provinces.push({
          //   type: 'geo_provinces',
          //   _id: rowData?.id,
          // });
        } else if (rowData?.idProvince && !rowData?.idDistrict && rowData?.id) {
          // filterData.amphures.push(rowData?.key);
          filterData.amphures.push({
            type: 'geo_amphures',
            _id: rowData?.id,
          });
        } else if (rowData?.idProvince && rowData?.idDistrict && rowData?.id) {
          const findProvince = filterData.provinces.find((pv) => pv?._id === rowData?.idProvince);
          if (_.isEmpty(findProvince)) {
            filterData.provinces.push({
              type: 'geo_provinces',
              _id: rowData?.idProvince,
            });
          }
          filterData.districts.push({
            type: 'geo_districts',
            _id: rowData?.id,
          });
        }
      });

      const deleteList = dataPolygonOrg?.polygons.filter((dl) => !filterData.idList.includes(dl._id));
      // const a = dataPolygonOrg?.polygons.filter(rd => rd._id)

      const geoProvincesList = [];
      for (let i = 0; i < filterData.provinces.length; i += cutSize) {
        const cutData = filterData.provinces.slice(i, i + cutSize);
        geoProvincesList.push(cutData);
      }

      const geoAmphuresList = [];
      for (let i = 0; i < filterData.amphures.length; i += cutSize) {
        const cutData = filterData.amphures.slice(i, i + cutSize);
        geoAmphuresList.push(cutData);
      }

      const geoDistrictsList = [];
      for (let i = 0; i < filterData.districts.length; i += cutSize) {
        const cutData = filterData.districts.slice(i, i + cutSize);
        geoDistrictsList.push(cutData);
      }

      try {
        // await personnel({
        //   method: 'PUT',
        //   url: `/organization_info/polygon?_id=${organizationID}`,
        //   data: { polygons: [], update_type: 'reset' },
        // });
        const promises = [];
        // clear polygon
        // const resPersonnel = await personnel({
        //   method: 'PUT',
        //   url: `/organization_info?_id=${organizationID}`,
        //   data: { polygons: [] },
        // });
        // if (!_.isEmpty(organizationID) && !_.isEmpty(promises)) {
        if (!_.isEmpty(organizationID)) {
          if (!_.isEmpty(deleteList)) {
            const resDelete = await personnel({
              method: 'PUT',
              url: `/organization_info/polygon?_id=${organizationID}`,
              data: { polygons: [...new Set(deleteList)], update_type: 'delete' },
            });
            promises.push(resDelete);
          }

          // if (!_.isEmpty(geoProvincesList)) {
          //   const resPersonnel = await personnel({
          //     method: 'PUT',
          //     url: `/organization_info/polygon?_id=${organizationID}`,
          //     data: { polygons: filterData.provinces, update_type: 'add' },
          //   });
          //   promises.push(resPersonnel);
          // }

          // if (!_.isEmpty(geoDistrictsList) && !_.isEmpty(promises)) {
          // if (!_.isEmpty(geoDistrictsList)) {
          if (!_.isEmpty(geoDistrictsList) && !_.isEmpty(geoProvincesList)) {
            const resPersonnel = await personnel({
              method: 'PUT',
              url: `/organization_info/polygon?_id=${organizationID}`,
              data: { polygons: [...filterData.districts, ...filterData.provinces], update_type: 'add' },
            });
            promises.push(resPersonnel);
            // const countSendArray = [];
            // geoDistrictsList.forEach(async (rowData, index) => {
            //   countSendArray.push(index);
            //   const callApi = mutateAsync({
            //     id: organizationID,
            //     // payload: { polygons: rowData },
            //     payload: { polygons: rowData, update_type: 'add' },
            //   });
            //   promises.push(callApi);
            // });
          }

          const resultCallApi = await Promise.all(promises)
            .then((data) => {
              DialogNotification('success', 'อัปเดตข้อมูลสำเร็จ');
              setLoaddingUpdate(false);
              return { status: true, result: data };
            })
            .catch((err) => {
              DialogNotification('error', 'อัปเดตรายการไม่สำเร็จ');
              setLoaddingUpdate(false);
              return { status: false, result: err };
            });
          //   // mutateAsync({ id: organization?._id, payload: { polygons: geoDistrictsList } });
        } else {
          setLoaddingUpdate(false);
          DialogNotification('error', 'ไม่พบองค์กร');
        }
      } catch (error) {
        setLoaddingUpdate(false);
        DialogNotification('error', 'ผิดพลาดไม่สามารถค้นหา polygon ได้');
      }
    } else {
      try {
        await personnel({
          method: 'PUT',
          url: `/organization_info/polygon?_id=${organizationID}`,
          data: { polygons: [], update_type: 'reset' },
        });
        DialogNotification('success', 'อัปเดตข้อมูลสำเร็จ');
      } catch (error) {
        console.log('error', error);
        DialogNotification('error', 'ผิดพลาดไม่สามารถค้นหา polygon ได้');
      }
      setLoaddingUpdate(false);
    }
  };

  return (
    <>
      <Row>
        <Col span={8}>
          <Input.Search placeholder="ค้นหา" onSearch={onSearch} allowClear />
          {(isLoading || mutationGetPolygon.isPending) && <Spin />}
          <Tree
            checkable
            // treeData={provinceList}
            treeData={treeCustomData}
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            autoExpandParent={autoExpandParent}
            height={500}
          />
        </Col>
        <Col span={16}>
          {isLoaded ? (
            <GoogleMap
              onLoad={onLoad}
              onUnmount={onUnmount}
              mapContainerStyle={containerStyle}
              center={centerGoogleMap}
              zoom={8}
              options={googleMapOptions.default}
            ></GoogleMap>
          ) : (
            <>
              <Spin size="large" />
            </>
          )}
        </Col>
      </Row>
      {!view && (
        <Guarded query={{ group: 'System Administration', type: 'พื้นที่รับผิดชอบ', action: 'update' }}>
          <Row justify="end" style={{ marginTop: 20 }}>
            <Button onClick={() => navigate(FIX_FIND_REDIRECT_PATH_SUCCESS)}>ยกเลิก</Button>
            <Button type="primary" loading={loaddingUpdate} onClick={onSubmitPolygon}>
              บันทึก
            </Button>
          </Row>
        </Guarded>
      )}
    </>
  );
};

export default AreaPolygonPage;
