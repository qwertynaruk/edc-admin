import useService from 'hooks/useService';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import PersonnelService from 'services/PersonelService';
import { serviceWrapper } from 'utils/serviceHelper';
import CustomSelect from '../CustomSelect';

function Child(props) {
  const { viewMode, onChange: onChangeProps, ...otherProps } = props;
  const { data: organizations, loading } = useService(serviceWrapper(PersonnelService.getRoleLevelOrganization), () => {
    return {
      params: {
        hotfix: 'organization-select-widget',
      },
    };
  });
  const options = useMemo(() => {
    if (!organizations) return [];
    return organizations.map((item) => {
      return {
        key: item._id,
        label: item.name,
        value: item._id,
      };
    });
  }, [organizations]);
  const onChange = (value) => {
    if (!onChangeProps) {
      return null;
    }
    onChangeProps(
      value,
      organizations.find((p) => p._id === value)
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

export default function OrganizationSelectWidget(props) {
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
