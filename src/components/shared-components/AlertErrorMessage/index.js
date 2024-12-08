import { Alert } from 'antd';

export const ResponseMessage = {
  'Sorry! An user with the email already exists': 'ขออภัย! มีผู้ใช้งานอีเมลนี้อยู่แล้ว',
  'Sorry! An user with the person card id already exists': 'ขออภัย! มีผู้ใช้งานรหัสบัตรประชาชนนี้อยู่แล้ว',
  'Password did not conform with policy': 'รหัสผ่านสามารถคาดเดาง่ายเกินไป',
  'Whoops! Something went wrong. Please try again later.': 'เกิดข้อผิดพลาด! กรุณาลองใหม่อีกครั้ง',
  'Sorry! An account with the given email / username already exists.': 'ขออภัย! มีผู้ใช้งานอีเมลนี้อยู่แล้ว',
  'Something went wrong. Please try again later': 'เกิดข้อผิดพลาด! กรุณาลองใหม่อีกครั้ง',
  duplicated_id_card: 'ขออภัย! มีผู้ใช้งานรหัสบัตรประชาชนนี้อยู่แล้ว',
  "duplicate_value: ['person_card_id']": 'ขออภัย! มีผู้ใช้งานรหัสบัตรประชาชนนี้อยู่แล้ว',
  "'email'": 'กรุณากรอกอีเมล',
  "'NoneType' object is not a mapping": 'เกิดข้อผิดพลาด! กรุณาลองใหม่อีกครั้ง',
  inventory_number_exists: 'ขออภัย! มีเลขครุภัณฑ์นี้อยู่แล้ว',
  'Sorry! The refresh token credentials does not match. An error occurred (NotAuthorizedException) when calling the InitiateAuth operation: Incorrect username or password.':
    'ขออภัย! รหัสผ่านเดิมไม่ถูกต้อง',
  'Sorry! An user already exists': 'ขออภัย! มีผู้ใช้งานนี้อยู่แล้ว',
  "duplicate_value: ['name']": 'ชื่อเคสไม่สามารถซ้ำกันได้',
  'Invalid old password': 'รหัสผ่านเก่าไม่ถูกต้อง',
};

const AlertErrorMessage = ({ message }) => {
  return message ? <Alert closable type="error" message={ResponseMessage[message] || message} /> : <></>;
};

export default AlertErrorMessage;
