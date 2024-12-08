export const displayShortDateFormat = (date) => {
  if (!date) {
    return '-';
  }

  const timestamp = new Date(date).getTime();

  const dft = Intl.DateTimeFormat('th-TH');

  return dft.format(timestamp);
};
