import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import { Col, Form, Select } from 'antd';
import PlaceLocalStore from 'mobx/PlaceLocalStore';
import _ from 'lodash';
import CustomSelect from '../CustomSelect';
import localSource from '../../../assets/data/geo-local.json';
import InputTextNumber from '../InputTextNumber';

const { Option } = Select;

const defaultFieldProp = {
  province: {
    label: 'จังหวัด',
    name: 'province',
    required: true,
    props: {},
  },
  city: {
    label: 'อำเภอ/เขต',
    name: 'city',
    required: true,
  },
  district: {
    label: 'ตำบล/แขวง',
    name: 'district',
    required: true,
  },
  zipcode: {
    label: 'รหัสไปรษณีย์',
    name: 'zipcode',
  },
};

const PlaceLocalWidget = ({ form, level, readOnly = false, fieldProp = {} }) => {
  const [cityItems, setCityItems] = useState([]);
  const [districtItems, setDistrictItems] = useState([]);

  const { province = {}, city = {}, district = {}, zipcode = {} } = fieldProp;
  const newFieldProp = {
    province: {
      ...defaultFieldProp.province,
      ...province,
    },
    city: {
      ...defaultFieldProp.city,
      ...city,
    },
    district: {
      ...defaultFieldProp.district,
      ...district,
    },
    zipcode: {
      ...defaultFieldProp.zipcode,
      ...zipcode,
    },
  };

  const { addressStackData = [] } = PlaceLocalStore;

  useEffect(() => {
    if (addressStackData.length > 0) {
      // จังหวัด
      const province = addressStackData.find((ex) => ex.types.includes('administrative_area_level_1'));

      // อำเภอ/เขต
      const city = addressStackData.find((ex) => {
        if (ex.types.includes('administrative_area_level_2')) {
          return true;
        }
        if (ex.types.includes('sublocality_level_2')) {
          return true;
        }
        return false;
      });

      // ตำบล/แขวง
      const district = addressStackData.find((ex) => {
        if (ex.types.includes('sublocality_level_2')) {
          return true;
        }
        if (ex.types.includes('locality')) {
          return true;
        }
        if (ex.types.includes('sublocality')) {
          return true;
        }
        return false;
      });

      if (province) {
        const isProvince = _.find(localSource, (item) => province.long_name === item.name_th);

        if (isProvince) {
          form.setFieldsValue({
            [newFieldProp.province.name]: isProvince.name_th,
          });

          onChangeProvince(isProvince.name_th, true);

          if (city) {
            const isCity = _.find(isProvince?.city, (item) => _.includes(city.long_name, item.name_th));

            if (isCity) {
              form.setFieldsValue({
                [newFieldProp.city.name]: isCity.name_th,
              });

              onChangeCity(isCity.name_th, isProvince?.city);

              if (district) {
                const isDistrict = _.find(isCity?.district, (item) => _.includes(district.long_name, item.name_th));

                if (isDistrict) {
                  form.setFieldsValue({
                    [newFieldProp.district.name]: isDistrict.name_th,
                  });

                  onChangeDistrict(isDistrict.name_th, isCity?.district);
                }
              }
            }
          }
        }
      }
    }
  }, [addressStackData]);

  const onChangeProvince = (provinceName, handleFormGMAP = false) => {
    if (level > 1) {
      form.setFieldsValue({
        [newFieldProp.city.name]: null,
        [newFieldProp.district.name]: null,
        [newFieldProp.zipcode.name]: null,
      });

      try {
        const selectProvince = _.find(localSource, (_items) => _items.name_th === provinceName);
        setCityItems(selectProvince?.city);

        const selectCity = _.find(addressStackData, (_items) =>
          _.includes(_items?.types, 'administrative_area_level_2')
        );

        if (selectCity && selectProvince?.city) {
          const callLocalCity = _.find(selectProvince?.city, (_items) =>
            _.includes(selectCity?.long_name, _items.name_th)
          );

          onChangeCity(callLocalCity.name_th, selectProvince?.city);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onChangeCity = (cityName, cityList = []) => {
    if (level > 2) {
      try {
        const directiveValues = cityList.length <= 0 ? cityItems : cityList;

        const selectCity = _.find(directiveValues, (_items) => _items.name_th === cityName);
        setDistrictItems(selectCity?.district);

        const selectDistrict = _.find(addressStackData, (_items) => _.includes(_items?.types, 'sublocality_level_1'));

        if (selectDistrict && selectCity?.district) {
          const callLocalDistrict = _.find(selectCity?.district, (_items) =>
            _.includes(selectDistrict?.long_name, _items.name_th)
          );

          onChangeDistrict(callLocalDistrict.name_th);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onChangeDistrict = (districtName, districtList = []) => {
    if (level > 3) {
      try {
        const directiveValues = districtList.length <= 0 ? districtItems : districtList;
        const selectDistrict = _.find(directiveValues, (_items) => _items.name_th === districtName);

        form.setFieldsValue({
          [newFieldProp.zipcode.name]: _.get(selectDistrict, 'zip_code'),
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const renderOption = (item) => {
    return item.map((el, _index) => (
      <Option key={el.id} value={el.name_th}>
        {el.name_th}
      </Option>
    ));
  };

  return (
    <>
      {level >= 1 && (
        <Col span={8}>
          <Form.Item
            name={newFieldProp.province.name}
            label={newFieldProp.province.label}
            rules={
              newFieldProp.province.rules || [
                {
                  required: newFieldProp.province.required,
                  message: 'กรุณาเลือกจังหวัด',
                },
              ]
            }
          >
            <CustomSelect
              showSearch
              placeholder="เลือกจังหวัด"
              onChange={(el) => onChangeProvince(el)}
              {...newFieldProp.province.props}
              className={readOnly ? 'gx-readonly' : ''}
            >
              {renderOption(localSource)}
            </CustomSelect>
          </Form.Item>
        </Col>
      )}

      {level >= 2 && (
        <Col span={8}>
          <Form.Item shouldUpdate noStyle>
            {() => (
              <Form.Item
                name={newFieldProp.city.name}
                label={newFieldProp.city.label}
                rules={[{ required: newFieldProp.city.required, message: 'กรุณาเลือกอำเภอ' }]}
              >
                <Select
                  placeholder="เลือกอำเภอ"
                  loading={PlaceLocalStore.action_city_loading}
                  disabled={!form.getFieldValue(newFieldProp.province.name) || PlaceLocalStore.action_city_loading}
                  onChange={(el) => onChangeCity(el)}
                  className={readOnly ? 'gx-readonly' : ''}
                >
                  {renderOption(cityItems)}
                </Select>
              </Form.Item>
            )}
          </Form.Item>
        </Col>
      )}

      {level >= 3 && (
        <Col span={8}>
          <Form.Item shouldUpdate noStyle>
            {() => (
              <Form.Item
                name={newFieldProp.district.name}
                label={newFieldProp.district.label}
                rules={[{ required: newFieldProp.district.required, message: 'กรุณาเลือกตำบล' }]}
              >
                <Select
                  placeholder="เลือกตำบล"
                  loading={PlaceLocalStore.action_district_loading}
                  disabled={!form.getFieldValue(newFieldProp.city.name) || PlaceLocalStore.action_district_loading}
                  onChange={(el) => onChangeDistrict(el)}
                  className={readOnly ? 'gx-readonly' : ''}
                >
                  {renderOption(districtItems)}
                </Select>
              </Form.Item>
            )}
          </Form.Item>
        </Col>
      )}

      {level >= 4 && (
        <Col span={8}>
          <Form.Item name={newFieldProp.zipcode.name} label={newFieldProp.zipcode.label}>
            <InputTextNumber placeholder="รหัสไปรษณีย์" readOnly />
          </Form.Item>
        </Col>
      )}
    </>
  );
};

export default observer(PlaceLocalWidget);
