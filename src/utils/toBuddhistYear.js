import moment from 'moment';

export default function toBuddhistYear(momentValue, format) {
  let valueData = '';
  if (!moment.isMoment(momentValue)) {
    valueData = moment(momentValue);
  } else {
    valueData = momentValue;
  }
  const christianYear = valueData.format('YYYY');
  const buddhishYear = (parseInt(christianYear) + 543).toString();
  return valueData
    .format(format.replace('YYYY', buddhishYear).replace('YY', buddhishYear.substring(2, 4)))
    .replace(christianYear, buddhishYear);
}
