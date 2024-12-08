import React from 'react';
import moment from 'moment';
const DatePickerISOHoC = (props) => {
  const { type = 'RangePicker', children, onChange, value = '', ...otherProps } = props;

  const onChangeDatePickle = (e) => {
    if (Array.isArray(e)) {
      const valueMap = e.map((data) => {
        if (typeof data === 'string') {
          return data;
        }

        return data.toISOString();
      });
      return onChange(valueMap);
    }
    if (typeof e === 'string') {
      return onChange(e);
    }
    if (!e) return onChange(e);
    return onChange(e.toISOString());
  };
  const valueDatePickle = React.useMemo(() => {
    if (value) {
      if (Array.isArray(value)) {
        return value.map((text) => {
          const convertToUtc = moment.utc(text).utcOffset('+07:00');
          if (!isNaN(convertToUtc)) {
            return convertToUtc;
          }
          return '';
        });
      }
      return moment.utc(value).utcOffset('+07:00');
    }
    return null;
  }, [value]);

  const childrenWithProps = React.cloneElement(children, {
    ...otherProps,
    onChange: onChangeDatePickle,
    value: valueDatePickle,
    // disabledDate: (current) => {
    //   let customDate = moment().format("YYYY-MM-DD");
    //   return current && current < moment(customDate, "YYYY-MM-DD");
    // },
  });
  return childrenWithProps;
};

export default DatePickerISOHoC;
