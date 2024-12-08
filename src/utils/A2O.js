import { columnDateRender } from 'components/shared-components/CustomTable/useTableColumnRender';
import _ from 'lodash';

const parseTypeOfString = (_string) => {
  const xSplit = _string.split('');
  if (xSplit[0] === '{' && xSplit[xSplit.length - 1] === '}') {
    return JSON.parse(_string);
  } else {
    return _string;
  }
};

const parseTypeOfObject = (_object) => {
  const c2array = Object.entries(_object);

  const _sideParse = (_values) => {
    if (typeof _values === 'string') {
      return parseTypeOfString(_values);
    }

    return _values;
  };

  return c2array.reduce(
    (a, v) => ({
      ...a,
      [v[0]]: _sideParse(v[1]),
    }),
    {}
  );
};

const JS_PARSE = (vx) => {
  if (typeof vx === 'string') {
    return parseTypeOfString(vx);
  }

  if (typeof vx === 'object' && !Array.isArray(vx) && vx !== null && Object.keys(vx).length > 0) {
    return parseTypeOfObject(vx);
  }

  if (Array.isArray(vx) && vx.length > 0) {
    const newVx = vx.map((el) => {
      if (typeof el === 'string') {
        return parseTypeOfString(el);
      }

      if (typeof el === 'object' && el && Object.keys(el).length > 0) {
        return parseTypeOfObject(el);
      }

      return el;
    });
    return newVx;
  }

  return vx;
};

const NEW_JSPARSE = (dataSet) => {
  const toArray = Object.entries(dataSet);

  const lv1Parse = toArray.reduce(
    (a, v) => ({
      ...a,
      [v[0]]: JS_PARSE(v[1]),
    }),
    {}
  );

  return lv1Parse;
};

const JSPARSE = (v) => {
  if (Array.isArray(v) && v.length > 0) {
    return v;
  } else {
    try {
      return JSON.parse(v);
    } catch (e) {
      return v;
    }
  }
};

const JSSTRINGIFY = (v) => {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return null;
  }
};

const IMPULSE_ARRAY_NULL = (_object, _key) => {
  return _.get(_object, _key, []) || [];
};

const TRIMNULL = (obj) => {
  const objParse = Object.entries(obj);
  const detectNull = objParse.filter(([_, v]) => !['ไม่ทราบ', undefined].includes(v));
  return Object.fromEntries(detectNull);
};

const OBJ_REVERSE = (arrs) => arrs.reduce((a, v) => ({ ...a, [v[0]]: v[1] }), {});

const WITHDEPATCH = (keyPatch, value) =>
  OBJ_REVERSE(Object.entries(value).filter((el) => el[0].split('_')[0] === keyPatch));

const SELECT_BYINDEX = (arrs, _index, numerics = true) => {
  const newArrs = arrs || [];

  if (newArrs.length > 0) {
    return numerics ? parseInt(arrs[_index]) : arrs[_index];
  } else {
    return null;
  }
};

const CONVERT_TBLCOLUMN = (column) => {
  const _tx = column
    .map((es) => {
      if (es.key !== 'cover_image_file' && es.dataIndex !== 'cover_image_file') {
        return {
          key: es.dataIndex ? es.dataIndex : es.key,
          label: es.title,
        };
      } else {
        return null;
      }
    })
    .filter((z) => z);

  const addSequence = [
    {
      key: 'key',
      label: 'ลำดับที่',
    },
  ];

  return addSequence.concat(_tx);
};

const PARSE_DATE = (arrs = []) => {
  return arrs.map((ss, _index) => ({
    ...ss,
    key: _index + 1,
    updated_at: columnDateRender(ss.updated_at),
  }));
};

const CHECK_TYPE = (ss) => {
  if (typeof ss === 'object') {
    return Object.keys(ss);
  } else {
    return [];
  }
};

const CHECK_ANY_OBJECT = (ss) => {
  return !_.isNil(ss) && _.isObjectLike(ss) && Object.keys(ss).length > 0;
};

const CHECK_ANY_ARRAY = (ss) => {
  return !_.isNil(ss) && Array.isArray(ss) && ss.length > 0;
};

const OBJ_OR_ARR = (ss, type = 'check_is') => {
  if (type === 'check_is') {
    return CHECK_ANY_ARRAY(ss) || CHECK_ANY_OBJECT(ss);
  } else if (type === 'parse_value') {
    if (CHECK_ANY_ARRAY(ss)) {
      return ss[0];
    }

    if (CHECK_ANY_OBJECT(ss)) {
      return ss;
    }
  } else {
    return null;
  }
};

const AGE_FROM_DATE = (_date) => {
  const birthDate = new Date(_date);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const GENERATE_FILTER_ITEMS = (dataSource, _keys) => {
  const _tx = _.map(dataSource, (draft) => ({ label: draft[_keys], value: draft[_keys] }));
  return _.uniqBy(_tx, 'label');
};

const UTC_SORT_DATETIME = (dataSource, selectKeys = 'updated_at', parseMethod = 'desc') => {
  return _.orderBy(dataSource, selectKeys, parseMethod);
};

export default {
  JSPARSE,
  TRIMNULL,
  WITHDEPATCH,
  IMPULSE_ARRAY_NULL,
  NEW_JSPARSE,
  JSSTRINGIFY,
  OBJ_REVERSE,
  SELECT_BYINDEX,
  CONVERT_TBLCOLUMN,
  PARSE_DATE,
  CHECK_TYPE,
  CHECK_ANY_OBJECT,
  CHECK_ANY_ARRAY,
  OBJ_OR_ARR,
  AGE_FROM_DATE,
  GENERATE_FILTER_ITEMS,
  UTC_SORT_DATETIME,
};
