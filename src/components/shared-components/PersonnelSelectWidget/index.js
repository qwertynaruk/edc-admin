import CustomSelect from '../CustomSelect';
import usePersonnel from 'hooks/services/usePersonnel';
import { renderPersonnelName } from 'utils/stringRender';
import { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { MAX_API_LIMIT } from 'constants/ApiConstant';

export function usePersonnelInSelectWidget({ category, ids, id }) {
  return usePersonnel(
    (() => {
      const payload = {
        params: {},
      };
      if (category) {
        payload.params.department = category;
      }
      if (ids || id) {
        payload.params._id = ids || id;
      }
      if (_.isEmpty(payload.params)) {
        payload.params.limit = MAX_API_LIMIT;
      }
      return payload;
    })()
  );
}

function Child(props) {
  const {
    category,
    ids,
    viewMode = { enable: false, values: '' },
    json = false,
    value: valueProp,
    onChange: onChangeProps,
    ...otherProps
  } = props;
  const id = _.get(viewMode, 'values._id', viewMode.values);
  const value = _.get(valueProp, '_id', valueProp);
  const { data, loading } = usePersonnelInSelectWidget({ category, ids, id });

  const personnel = useMemo(() => {
    if (!data) {
      return [];
    }
    if (_.isEmpty(data)) {
      return [];
    }
    return data.map((item) => {
      return {
        label: renderPersonnelName(item),
        value: json ? JSON.stringify(item) : item._id,
      };
    });
  }, [data, json]);

  const renderLabel = useMemo(() => {
    const personal = (_.isEmpty(data) ? [] : data)?.find((ss) => ss._id === id);
    return personal ? renderPersonnelName(personal) : '-';
  }, [data, id]);

  const onChange = (value) => {
    if (onChangeProps) {
      onChangeProps(
        value,
        data.find((x) => x._id === value)
      );
    }
  };

  return viewMode.enable ? (
    renderLabel
  ) : (
    <CustomSelect
      showSearch
      loading={loading}
      options={personnel}
      value={value}
      onChange={onChange}
      {...otherProps}
      allowClear
      optionFilterProp="children"
      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
    />
  );
}

function PersonnelSelectWidget(props) {
  const [showElement, setShowElement] = useState(false);

  useEffect(() => {
    setShowElement(true);
  }, []);

  if (!showElement) {
    return null;
  }
  return <Child {...props} />;
}

export default PersonnelSelectWidget;
