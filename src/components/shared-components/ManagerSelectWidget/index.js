import useService from 'hooks/useService';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import PersonnelService from 'services/PersonelService';
import { serviceWrapper } from 'utils/serviceHelper';
import CustomSelect from '../CustomSelect';

function getID(obj) {
  if (Array.isArray(obj)) {
    if (obj.length === 1) {
      return _.get(obj, '0._id');
    }
  }
  return obj;
}

function Child(props) {
  const { viewMode, onChange: onChangeProps, isManager = true, ...otherProps } = props;
  const { data: managers, loading } = useService(serviceWrapper(PersonnelService.getLeader), () => {
    return {
      params: {
        hotfix: 'manager-select-widget',
        is_manager: isManager,
        department_id: getID(props.department),
        position_id: getID(props.position),
        personnel_id: getID(props.personnel),
      },
    };
  });
  const options = useMemo(() => {
    if (!Array.isArray(managers)) return [];
    return managers.map((item) => {
      return {
        key: item._id,
        label: _.compact([item.position_abbreviation || item.prefix_name, item.first_name, item.last_name]).join(' '),
        value: item._id,
      };
    });
  }, [managers]);
  const onChange = (value) => {
    if (!onChangeProps) {
      return null;
    }
    onChangeProps(
      value,
      managers.find((p) => p._id === value)
    );
  };
  if (viewMode) {
    return options.find((o) => o.value === viewMode)?.label || '-';
  }
  return (
    <CustomSelect
      showSearch
      loading={loading}
      options={options}
      onChange={onChange}
      optionFilterProp="label"
      {...otherProps}
    />
  );
}

export default function ManagerSelectWidget(props) {
  const [showElement, setShowElement] = useState(false);

  useEffect(() => {
    setShowElement(true);
  }, []);

  if (!showElement) {
    return null;
  }

  if (Array.isArray(props.value)) {
    if (props.value.length === 1) {
      const value = _.get(props, 'value.0._id');
      if (props.onChange) {
        props.onChange(value);
      }
      return <Child {...props} value={_.get(props, 'value.0._id')} />;
    }
  }

  return <Child {...props} />;
}
