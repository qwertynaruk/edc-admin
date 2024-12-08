import _ from 'lodash';
import dayjs from 'dayjs';
import moment from 'moment';
const defaultInput = 'H:mm:ss';
const defaultTime = 'HH:mm:ss';
export const checkIsvalidTime = (date = null, formatOutput = defaultTime) => {
  if (_.isEmpty(date)) return '-';
  const originDateDayjs = dayjs(date, defaultInput);
  const originDateMoment = moment(date, defaultInput);
  const convertDate = originDateDayjs.isValid()
    ? originDateDayjs.format(formatOutput)
    : originDateMoment.isValid()
    ? originDateMoment.format(formatOutput)
    : null;
  return convertDate;
};

export const getTimeCalling = (date) => {
  const originalDate = checkIsvalidTime(date);
  if (_.isEmpty(originalDate)) {
    return '-';
  } else {
    const getTimeCall = moment(originalDate, defaultTime);
    const timeString = `${getTimeCall.hour() > 0 ? getTimeCall.hour() + ' ชั่วโมง' : ''}${
      getTimeCall.minute() > 0 ? ' ' + getTimeCall.minute() + ' นาที' : ''
    }${getTimeCall.second() > 0 ? ' ' + getTimeCall.second() + ' วินาที' : ''}`;
    return !_.isEmpty(timeString) ? ' ' + timeString : '';
  }
};

export function calculateAge(date = null) {
  if (!date) return 0;
  const birthdate = new Date(date);
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDifference = today.getMonth() - birthdate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  return age;
}
