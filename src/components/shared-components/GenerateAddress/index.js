import _ from 'lodash';
import { toJS } from 'mobx';

export const addressPadView = (address) => {
  const tm = [];
  tm.push(_.get(address, 'home_number', '') || '');

  if (address.village_group_number) {
    tm.push(`หมู่ที่ ${address.village_group_number}`);
  }

  if (address.roadname) {
    tm.push(`ถนน ${address.roadname}`);
  }

  if (address.alley) {
    tm.push(`ตรอก ${address.alley}`);
  }

  if (address.sub_alley) {
    tm.push(`ซอย ${address.sub_alley}`);
  }

  if (address.crossroads_1) {
    tm.push(`แยก(1) ${address.crossroads_1}`);
  }

  if (address.crossroads_2) {
    tm.push(`แยก(2) ${address.crossroads_2}`);
  }

  tm.push(`ตำบล/แขวง ${_.get(address, 'district', '')}`);
  tm.push(`อำเภอ/เขต ${_.get(address, 'city', '')}`);
  tm.push(`จังหวัด ${_.get(address, 'province', '')}`);
  tm.push(_.get(address, 'zipcode', ''));

  return tm.join(' ');
};

const GenerateAddress = (e, plainText = false) => {
  const toItem = toJS(e);
  if (!toItem || Object.keys(toItem).length <= 0) {
    return '-';
  }

  if (plainText) {
    return addressPadView(toItem);
  }

  return <label className="address-set-text">{addressPadView(toItem)}</label>;
};

export default GenerateAddress;
