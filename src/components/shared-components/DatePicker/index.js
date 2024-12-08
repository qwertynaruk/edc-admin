import { useMemo } from 'react';
import generatePicker from 'antd/lib/date-picker/generatePicker';
import toBuddhistYear from 'utils/toBuddhistYear';
import momentGenerateConfig from 'rc-picker/lib/generate/moment';
import moment from 'moment';
import 'moment/locale/th';
import locale from 'antd/es/date-picker/locale/th_TH';
import produce from 'immer';

moment.locale('th');

const config = {
  ...momentGenerateConfig,
  setYear: (date, year) => {
    const clone = date.clone();
    return clone.year(year - 543);
  },
  getYear: (date) => {
    const clone = date.clone();
    return clone.year() + 543;
  },
};
const DatePicker = generatePicker(config);

const dpTH = produce(locale, (draft) => {
  draft.lang.yearFormat = (value) => {
    return toBuddhistYear(value, 'YYYY');
  };
});

function CustomDatePicker(props) {
  const valueData = useMemo(() => {
    if (!moment.isMoment(props.value) && props.value) {
      return moment(props.value);
    } else {
      return props.value;
    }
  }, [props.value]);

  return (
    <DatePicker
      locale={dpTH}
      format={(value) => {
        if (props.showTime) {
          return toBuddhistYear(value, 'YYYY-MM-DD HH:mm:ss');
        }
        return toBuddhistYear(value, 'YYYY-MM-DD');
      }}
      // ลองทำดูแล้ว ไม่ได้
      // panelRender={(node) => {
      //   return cloneElement(node, {
      //     ...node.props,
      //     generateConfig: {
      //       ...node.props.generateConfig,
      //       // addYear: (value, diff) => {
      //       //   // console.log(value, value.format('YYYY'), diff, 'value');
      //       //   return value.add(diff, 'years').format('YYYY');
      //       // },
      //       // getYear: (value) => {
      //       //   // return toBuddhistYear(value, 'YYYY');
      //       //   // console.log(value.year(), 'aslkjf');
      //       //   // if (value.year() === moment().year()) {
      //       //   //   return toBuddhistYear(value, 'YYYY');
      //       //   // }
      //       //   return value.format('YYYY');
      //       // },
      //     },
      //     locale: {
      //       ...node.props.locale,
      //       yearFormat: (value) => {
      //         return toBuddhistYear(value, 'YYYY');
      //       },
      //     },
      //   });
      // }}
      className="gx-w-100"
      {...props}
      value={valueData}
    />
  );
}

function CustomRangePicker(props) {
  // ลองแล้วไม่ work
  // const panelRender = (node) => {
  //   return cloneElement(node, {
  //     ...node.props,
  //     children: [
  //       cloneElement(node.props.children[0], {
  //         ...node.props.children[0].props,
  //         children: cloneElement(node.props.children[0].props.children, {
  //           ...node.props.children[0].props.children.props,
  //           children: [
  //             cloneElement(node.props.children[0].props.children.props.children[0], {
  //               ...node.props.children[0].props.children.props.children[0].props,
  //               children: cloneElement(node.props.children[0].props.children.props.children[0].props.children, {
  //                 locale: {
  //                   ...node.props.children[0].props.children.props.children[0].props.children.props.locale,
  //                   yearFormat: (value) => {
  //                     return toBuddhistYear(value, 'YYYY');
  //                   },
  //                 },
  //               }),
  //             }),
  //             cloneElement(node.props.children[0].props.children.props.children[1], {
  //               ...node.props.children[0].props.children.props.children[1].props,
  //               children: cloneElement(node.props.children[0].props.children.props.children[1].props.children, {
  //                 locale: {
  //                   ...node.props.children[0].props.children.props.children[1].props.children.props.locale,
  //                   yearFormat: (value) => {
  //                     return toBuddhistYear(value, 'YYYY');
  //                   },
  //                 },
  //               }),
  //             }),
  //           ],
  //         }),
  //       }),
  //       node.props.children[1],
  //     ],
  //   });
  // };
  return (
    <DatePicker.RangePicker
      // locale={{
      //   ...locale,
      //   lang: {
      //     ...locale.lang,
      //     yearFormat: (value) => {
      //       return toBuddhistYear(value, 'YYYY');
      //     },
      //   },
      // }}
      locale={dpTH}
      format={(value) => {
        if (props.showTime) {
          return toBuddhistYear(value, 'YYYY-MM-DD HH:mm:ss');
        }
        return toBuddhistYear(value, 'YYYY-MM-DD');
      }}
      // panelRender={panelRender}
      {...props}
    />
  );
}

function mergeComponent() {
  const merged = CustomDatePicker;
  merged.RangePicker = CustomRangePicker;
  return merged;
}

export default mergeComponent();
