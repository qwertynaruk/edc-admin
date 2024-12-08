import React from 'react';
import { ThaiDateTime } from 'utils/ThaiDateTime';
import _ from 'lodash';
import moment from 'moment';
import thMsg from '../assets/data/portal-form-list.json';

const arrayCategoryDoc = [
  {
    label: 'ตั๋วจำนำ',
    disabled: false,
    value: 'pawn_ticket',
  },
  {
    label: 'ทะเบียนบ้าน',

    disabled: false,
    value: 'house_particulars',
  },
  {
    label: 'บัตรข้าราชการ',

    disabled: false,
    value: 'civil_servant_card',
  },
  {
    label: 'บัตรประกันสังคม',

    disabled: false,
    value: 'social_security_card',
  },
  {
    label: 'บัตรประจำตัวผู้เสียภาษี',

    disabled: false,
    value: 'tax_identification_card',
  },
  {
    label: 'บัตรสวัสดิการแห่งรัฐ',
    disabled: false,
    value: 'state_welfare_card',
  },
  {
    label: 'สมุดบัญชีธนาคาร',

    disabled: false,
    value: 'bank_book',
  },
  {
    label: 'สลากออมสิน',

    disabled: false,
    value: 'piggy_bank',
  },
  {
    label: 'เช็ค / สมุดเช็ค',

    disabled: false,
    value: 'check_book_number',
  },
  {
    label: 'โฉนดที่ดิน',

    disabled: false,
    value: 'title_deeds',
  },
  {
    label: 'ใบกรมธรรม์',

    disabled: false,
    value: 'insurance_policy',
  },
  {
    label: 'ใบคู่มือการจดทะเบียนรถ',

    disabled: false,
    value: 'vehicle_registration',
  },
  {
    label: 'ใบรับรองผลการเรียน',

    disabled: false,
    value: 'transcripts',
  },
  {
    label: 'ใบสำคัญการสมรส',

    disabled: false,
    value: 'marriage_certificate',
  },
  {
    label: 'เอกสารอื่นๆ',

    disabled: false,
    value: 'others',
  },
];

const initialState = {
  _id: '',
  report_detail: {
    StartDateTime: '',
    CaseDetail: '',
    occupation: '',
    'accept-document-at-station': false,
    'owner-fullname': '',
    'lost-of-address': '',
  },
  report_type_id: '',
  reporter: {
    address_th: '',
    date_of_birth_th: '',
    district_th: '',
    id_card: '',
    name_eng: '',
    name_th: '',
    province_th: '',
    sub_district_th: '',
    id: '',
  },
  report_location: {
    'rd3-system': '',
    ' rd2-system': '',
    'province-system': '',
    'zipcode-system': '',
  },
  report_attachments: [],
  comments: [],
  status: '',
  report_record_id: '',
  updated_at: '',
  created_at: '',
  form: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'setReport': {
      const { report_detail = {}, reporter = {}, report_location = {}, location_description = '' } = action.payload;
      const { CaseDetail = '' } = report_detail;
      if (CaseDetail) {
        const [type = {}] = arrayCategoryDoc.filter(({ value }) => value === CaseDetail);
        const { label = '' } = type;
        // action.payload.report_detail.CaseDetail = label || '-';
        action.payload.report_detail.CaseDetail = label || CaseDetail || '-';
      }
      if (location_description) {
        report_location.location_description = location_description;
      }

      const form = objToWebForm({
        report_detail,
        report_location,
        reporter,
      });
      return { ...state, ...{ ...action.payload, form } };
    }
    default:
      throw new Error();
  }
}

const filterInitialValueComponent = (data) => {
  const resp = data.filter(({ component }) => component.filter(({ initialValue }) => initialValue).length > 0);
  return resp;
};

const objToWebForm = (data = {}) => {
  const entries = Object.entries(data);
  const section = entries.map(([data_element_key = '', component = {}]) => {
    return {
      section_name: data_element_key,
      data_element_key,
      component: Object.entries(component).map(([key = '', initialValue = '']) => {
        return {
          key,
          initialValue,
          readOnly: true,
          label: component?.label,
          parent: data_element_key,
        };
      }),
    };
  });
  return filterInitialValueComponent(section);
};

const displayInputLabel = (ev2) => {
  const { key = '', parent = '' } = ev2;

  try {
    const parentMsg = thMsg[parent];
    return parentMsg[key];
  } catch (error) {
    return ev2?.label || 'คำถาม';
  }
};

const displayInputValue = (ev2, localTime = false) => {
  const { initialValue = '', key, widget = '' } = ev2;
  if (typeof initialValue === 'boolean') {
    return initialValue ? 'ใช่' : 'ไม่ใช่';
  }
  if (key === 'StartDateTime' || key === 'EndDateTime' || key === 'order_time' || key === 'arrived_time') {
    if (localTime) {
      return initialValue ? moment(initialValue).local().add('year', 543).format('DD MMM YYYY HH:mm:ss') : '-';
    } else {
      return initialValue ? ThaiDateTime(moment.utc(initialValue).toDate(), 'short-month-full') : '-';
    }
  }
  if (key === 'LocationType' || key === 'PlaceType') {
    const [filter = {}] = thMsg.PlaceType.filter((el) => el.code === initialValue);
    const { name_th = '' } = filter;
    return name_th;
  }
  if (key === 'location') {
    return _.get(initialValue, 'coordinates', []).toString();
  }

  if (key === 'start_and_end_date') {
    let ex = initialValue.map((ss) => ThaiDateTime(moment.utc(ss).toDate(), 'short-month-full'));
    if (localTime) {
      ex = initialValue.map((ss) => moment(ss).local().add('year', 543).format('DD MMM YYYY HH:mm:ss'));
    }
    return ex.join(' - ');
  }

  if (widget === 'time-picker') {
    try {
      const st = _.last(_.split(initialValue, ' '));
      return `${st} น.`;
    } catch (error) {
      return 'ไม่ได้ระบุ';
    }
  }

  return initialValue || '-';
};
const useConvertWebForm = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const dataWebForm = state;
  const setDataListReport = (report) => {
    dispatch({ type: 'setReport', payload: report });
  };

  return {
    setDataListReport,
    dataWebForm,
    displayInputValue,
    displayInputLabel,
  };
};

export default useConvertWebForm;
