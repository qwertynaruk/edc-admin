import _ from 'lodash';

const errorList = [
  { key: 'person_card_id', text: 'บัตรประจำตัวประชาขนนี้มีแล้ว' },
  { key: 'phone_number', text: 'เบอร์โทรนี้มีแล้ว' },
  { key: 'email', text: 'อีเมลนี้มีแล้ว' },
];

export const handleError = (error, messageError) => {
  let message = messageError;
  if (error?.response?.data?.response?.error_code === 'VALIDATION_ERROR') {
    message = '';
    if (!_.isEmpty(error?.response?.data?.response?.detail)) {
      error?.response?.data?.response?.detail.forEach((rowData, index) => {
        message += `${index > 0 ? ', ' : ''}${errorList.find((rd) => rd.key === rowData)?.text ?? ''}`;
      });
    } else {
      message = 'ผู้ใช้นี้มีในระบบแล้ว กรุณาติดต่อ admin';
    }
  }
  return message;
};
