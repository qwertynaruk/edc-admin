import useService from 'hooks/useService';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import PersonnelService from 'services/PersonelService';
import { serviceWrapper } from 'utils/serviceHelper';
import CustomSelect from '../CustomSelect';

export function usePositions() {
  return useService(serviceWrapper(PersonnelService.getRoleLevelPosition), () => {
    return {
      params: {
        hotfix: 'position-select-widget',
      },
    };
  });
}

function Child(props) {
  const { viewMode, value, onChange: onChangeProps, ...otherProps } = props;
  const { data: positions, loading } = usePositions();
  const options = useMemo(() => {
    if (!positions) return [];
    return positions.map((item) => {
      return {
        key: item._id,
        label: item.name,
        value: item._id,
      };
    });
  }, [positions]);
  const onChange = (value) => {
    if (!onChangeProps) {
      return null;
    }
    onChangeProps(
      value,
      positions.find((p) => p._id === value)
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
      value={value}
      optionFilterProp="label"
      {...otherProps}
    />
  );
}

export default function PositionSelectWidget(props) {
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
