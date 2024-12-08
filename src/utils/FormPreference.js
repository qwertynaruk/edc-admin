import { Select } from 'antd';
import { MAX_API_LIMIT } from 'constants/ApiConstant';
import usePersonnel from 'hooks/services/usePersonnel';
import _ from 'lodash';
import A2O from './A2O';
const { Option } = Select;

const ResetFieldOnCheckTrigger = (form, value, _condition = false, _target) => {
  const handleCheck = _.get(value, 'target.checked', false);

  if (handleCheck === _condition) {
    form.setFieldsValue({
      [_target]: null,
    });
  }
};

const ComplexFullnameWithoutDom = (payload = {}) => {
  if (!payload || Object.keys(payload).length <= 0) {
    return '-';
  }

  const { unknown_profile_firstname = false, unknown_profile_lastname = false } = payload;

  const isFirstName = unknown_profile_firstname ? 'ไม่ทราบชื่อจริง' : _.get(payload, 'profile_firstname', '');
  const isLastName = unknown_profile_lastname ? 'ไม่ทราบนามสกุล' : _.get(payload, 'profile_lastname', '');

  return [_.get(payload, 'profile_prefix', ''), isFirstName, _.get(payload, 'profile_middlename', ''), isLastName].join(
    ' '
  );
};

const ComplexFullname = ({ payload = {}, withInspectData = false }) => {
  if (!payload || Object.keys(payload).length <= 0) {
    return '-';
  }

  const { unknown_profile_firstname = false, unknown_profile_lastname = false } = payload;

  const isFirstName = unknown_profile_firstname ? 'ไม่ทราบชื่อจริง' : _.get(payload, 'profile_firstname', '');
  const isLastName = unknown_profile_lastname ? 'ไม่ทราบนามสกุล' : _.get(payload, 'profile_lastname', '');

  if (withInspectData) {
    const _age = _.get(payload, 'basic.basic_profile_birthdate', false)
      ? `${A2O.AGE_FROM_DATE(_.get(payload, 'basic.basic_profile_birthdate', null))} ปี`
      : _.get(payload, 'basic.basic_profile_age_range', null)
      ? `${payload.basic.basic_profile_age_range.join(' - ')} ปี`
      : '-';
    const idCard = _.get(payload, 'id_card', 'ไม่ทราบ');
    return [
      _.get(payload, 'profile_prefix', ''),
      isFirstName,
      _.get(payload, 'profile_middlename', ''),
      isLastName,
      `อายุ ${_age}`,
      `เลขประจำตัวประชาชน ${idCard}`,
    ].join(' ');
  } else {
    return [
      _.get(payload, 'profile_prefix', ''),
      isFirstName,
      _.get(payload, 'profile_middlename', ''),
      isLastName,
    ].join(' ');
  }
};

const ComplexJuristicFullname = ({ payload = {} }) => {
  if (!payload || Object.keys(payload).length <= 0) {
    return '-';
  }

  return [_.get(payload, 'juristic_name', '-'), `เลขที่ผู้เสียภาษี ${_.get(payload, 'id_juristic', '-')}`].join(' ');
};

const CanCheckFullnameForComplex = (data) => {
  const { payload = [] } = data;

  if (payload.length > 0) {
    return _.get(payload[0], 'is_juristic', false) ? (
      <ComplexJuristicFullname payload={payload[0]} />
    ) : (
      <ComplexFullname payload={payload[0]} />
    );
  } else {
    return '-';
  }
};

const JuristicOrPerson = (payload = {}) => {
  if (Object.keys(payload).length > 0) {
    if (_.get(payload, 'is_juristic', false)) {
      return _.get(payload, 'juristic_name', 'ไม่ทราบชื่อนิติบุคคล');
    } else {
      return [
        _.get(payload, 'profile_firstname', 'ไม่ทราบชื่อจริง'),
        _.get(payload, 'profile_lastname', 'ไม่ทราบนามสกุล'),
      ].join(' ');
    }
  }

  return '-';
};

const RenderYearList = () => {
  const date = new Date();
  const yearStack = [];

  for (let index = 1900; index <= date.getFullYear(); index++) {
    yearStack.push(
      <Option key={index} value={index + 543}>
        {index + 543}
      </Option>
    );
  }

  return yearStack.reverse();
};

const InitContentProperty = (typeIs = '', payload = {}) => {
  const txType = {
    drug: [
      'ยาเสพติด',
      _.get(payload, 'name', '-'),
      `จำนวน ${_.get(payload, 'quantity', 1)}`,
      _.get(payload, 'unit', ''),
    ],
    firearm: [
      'อาวุธ',
      _.get(payload, 'type', '-'),
      _.get(payload, 'brand', ''),
      _.get(payload, 'model', ''),
      `จำนวน ${_.get(payload, 'quantity', 1)}`,
      _.get(payload, 'unit', ''),
    ],
    other: [
      _.get(payload, 'type', '-'),
      _.get(payload, 'detail', ''),
      `จำนวน ${_.get(payload, 'quantity', 1)}`,
      _.get(payload, 'unit', ''),
    ],
    vehicle: [
      _.get(payload, 'type', ''),
      _.get(payload, 'regis_character', ''),
      _.get(payload, 'regis_number', ''),
      _.get(payload, 'regis_province', ''),
    ],
    '': [],
  };

  return txType[typeIs].join(' ');
};

const PropertyContent = ({ typeIs = '', payload = {} }) => {
  return InitContentProperty(typeIs, payload);
};

const PropertyContentWithoutDom = (typeIs = '', payload = {}) => {
  return InitContentProperty(typeIs, payload);
};

const RenderMapFormatter = (_frontName, type) => {
  if (_frontName && Object.keys(_frontName).length > 0) {
    if (type === 'fullname') {
      return [
        _.get(_frontName, 'dominate_abbreviation', ''),
        _.get(_frontName, 'first_name', ''),
        _.get(_frontName, 'last_name', ''),
      ].join(' ');
    } else if (type === 'position') {
      return [
        _.get(_frontName, 'position_abbreviation', ''),
        `(${_.get(_frontName, 'position.name', '')})`,
        _.get(_frontName, 'station', ''),
      ].join(' ');
    } else if (type === 'prefix') {
      return _.get(_frontName, 'dominate_abbreviation', '');
    } else if (type === 'shortname') {
      return [_.get(_frontName, 'first_name', ''), _.get(_frontName, 'last_name', '')].join(' ');
    } else {
      return '-';
    }
  }

  return '-';
};

const ComplexPersonnel = (isId = '', type = 'fullname', haveData = false, objData = {}) => {
  const { data: _personnel } = usePersonnel({
    params: {
      limit: MAX_API_LIMIT,
    },
  });

  if (haveData) {
    return RenderMapFormatter(objData, type);
  } else {
    const _frontName = _personnel?.find((ss) => ss._id === isId);
    return RenderMapFormatter(_frontName, type);
  }
};

export default {
  ResetFieldOnCheckTrigger,
  CanCheckFullnameForComplex,
  ComplexFullnameWithoutDom,
  ComplexFullname,
  ComplexJuristicFullname,
  ComplexPersonnel,
  RenderYearList,
  PropertyContent,
  PropertyContentWithoutDom,
  JuristicOrPerson,
};
