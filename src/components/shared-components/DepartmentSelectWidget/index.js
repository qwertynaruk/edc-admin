import useService from 'hooks/useService';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import PersonnelService from 'services/PersonelService';
import { serviceWrapper } from 'utils/serviceHelper';
import CustomSelect from '../CustomSelect';

function Child(props) {
  const { viewMode, value, onChange: onChangeProps, placeholder, ...otherProps } = props;
  const { data: departments, loading } = useService(serviceWrapper(PersonnelService.getRoleLevelDepartment), () => {
    const newParams = {
      hotfix: 'deparment-select-widget',
      organization_ids: props?.orgId,
    };

    if (!props?.orgId) {
      delete newParams?.organization_id;
    }

    return {
      params: newParams,
    };
  });
  const options = useMemo(() => {
    if (!departments) return [];
    return departments.map((item) => {
      return {
        key: item._id,
        label: item.name,
        value: item._id,
      };
    });
  }, [departments]);
  const onChange = (value) => {
    if (!onChangeProps) {
      return null;
    }
    onChangeProps(
      value,
      departments.find((p) => p._id === value)
    );
  };
  if (viewMode) {
    return options.find((o) => o.value === value)?.label || '-';
  }
  return (
    <CustomSelect
      showSearch
      loading={loading}
      options={options}
      onChange={onChange}
      placeholder={placeholder}
      optionFilterProp="label"
      value={value}
      {...otherProps}
    />
  );
}

export default function DepartmentSelectWidget(props) {
  const [showElement, setShowElement] = useState(false);

  useEffect(() => {
    setShowElement(true);
  }, []);

  if (!showElement) {
    return null;
  }

  if (Array.isArray(props.value) && props.mode !== 'multiple') {
    if (props.value.length === 1) {
      const value = _.get(props, 'value.0._id');
      if (props.onChange) {
        props.onChange(value);
      }
      return <Child {...props} value={value} />;
    }
  }

  return <Child {...props} />;
}
