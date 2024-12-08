export const LeadingZero = (tt) => (tt < 10 ? `0${tt}` : tt);

const monthText = [
  { long: 'มกราคม', short: 'ม.ค.' },
  { long: 'กุมภาพันธ', short: 'ก.พ.' },
  { long: 'มีนาคม', short: 'มี.ค.' },
  { long: 'เมษายน', short: 'เม.ย.' },
  { long: 'พฤษภาคม', short: 'พ.ค.' },
  { long: 'มิถุนายน', short: 'มิ.ย.' },
  { long: 'กรกฎาคม', short: 'ก.ค.' },
  { long: 'สิงหาคม', short: 'ส.ค.' },
  { long: 'กันยายน', short: 'ก.ย.' },
  { long: 'ตุลาคม', short: 'ต.ค.' },
  { long: 'พฤศจิกายน', short: 'พ.ย.' },
  { long: 'ธันวาคม', short: 'ธ.ค.' },
];

export const ThaiDateTime = (toDate, format = 'full', dateOperation = null) => {
  const date = toDate ? new Date(toDate) : new Date();
  date.setFullYear(date.getFullYear() + 543);

  if (dateOperation) {
    const _f = dateOperation.split('');
    if (_f[0] === '-') {
      date.setDate(date.getDate() - parseInt(_f[1]));
    }

    if (_f[1] === '+') {
      date.setDate(date.getDate() + parseInt(_f[1]));
    }
  }

  const fullDay = {
    d: LeadingZero(date.getDate()),
    m: LeadingZero(date.getMonth()),
    mx: date.getMonth(),
    y: LeadingZero(date.getFullYear()),
    h: LeadingZero(date.getHours()),
    mm: LeadingZero(date.getMinutes()),
    s: LeadingZero(date.getSeconds()),
  };

  const dAndt = `${fullDay.d}/${fullDay.m}/${fullDay.y} ${fullDay.h}:${fullDay.mm}:${fullDay.s}`;
  const fullMontName = `${fullDay.d} ${monthText[fullDay.mx].long} ${fullDay.y}`;
  const onlyMontName = `${monthText[fullDay.mx].long} ${fullDay.y}`;
  const onlyUTCDate = dAndt.split(' ')[0];
  const onlyUTCTime = dAndt.split(' ')[1];
  const onlyMonth = monthText[fullDay.mx].long;
  const onlyDay = fullDay.d;
  const onlyYear = fullDay.y;
  const onlyTime = `${fullDay.h}:${fullDay.mm}`;
  const shortMonth = `${fullDay.d} ${monthText[fullDay.mx].short} ${fullDay.y}`;
  const shortMonthWithTime = `${fullDay.d} ${monthText[fullDay.mx].short} ${fullDay.y} ${fullDay.h}:${fullDay.mm}:${
    fullDay.s
  }`;
  const shortMonthWithShortTime = `${fullDay.d} ${monthText[fullDay.mx].short} ${fullDay.y} ${fullDay.h}:${fullDay.mm}`;
  const timeStamp = `${fullDay.d}${fullDay.m}${fullDay.y}${fullDay.h}${fullDay.mm}`;

  try {
    switch (format) {
      case 'full':
        return dAndt;
      case 'middle':
        return fullMontName;
      case 'short':
        return onlyMontName;
      case 'date-only':
        return onlyUTCDate;
      case 'time-only':
        return onlyUTCTime;
      case 'short-month':
        return shortMonth;
      case 'short-month-full':
        return shortMonthWithTime;
      case 'short-month-short-time':
        return shortMonthWithShortTime;
      case 'only-month':
        return onlyMonth;
      case 'only-day':
        return onlyDay;
      case 'only-year':
        return onlyYear;
      case 'only-time':
        return onlyTime;
      case 'now':
        return timeStamp;
      default:
        return dAndt;
    }
  } catch (error) {
    return '-';
  }
};
