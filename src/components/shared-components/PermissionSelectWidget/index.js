import useService from 'hooks/useService';
import { useEffect, useMemo, useState } from 'react';
import AbilityService from 'services/AbilityService';
import CustomSelect from '../CustomSelect';
import { serviceWrapper } from 'utils/serviceHelper';
import _ from 'lodash';

export function getListPermission(permissions, userIds) {
  const u = _.compact(userIds);
  return _.compact(permissions).flatMap((p) => {
    return u.map((x) => {
      return {
        user_id: x,
        permission_id: p._id,
      };
    });
  });
}

export function usePermissions(filter = {}) {
  const { canView = false, canEdit = false, canFind = false, canManage = false } = filter;
  const s = useService(serviceWrapper(AbilityService.permissions), () => {
    return {
      params: {
        hotfix: 'permissions-select-widget',
      },
    };
  });
  const { data } = s;
  if (!Array.isArray(data)) return s;
  return {
    ...s,
    data: _.isEmpty(filter)
      ? data
      : data.filter((item) => {
          if (canView && item.name === 'Can view') return true;
          if (canEdit && item.name === 'Can edit') return true;
          if (canFind && item.name === 'Can find') return true;
          if (canManage && item.name === 'Can manage') return true;
          return false;
        }),
  };
}

function Child(props) {
  const { viewMode, value, onChange: onChangeProps, ...otherProps } = props;
  const { data: permissions, loading } = usePermissions();
  const options = useMemo(() => {
    if (!permissions) return [];
    return permissions.map((item) => {
      return {
        key: item._id,
        label: item.detail,
        value: item._id,
      };
    });
  }, [permissions]);
  const onChange = (value) => {
    if (!onChangeProps) {
      return null;
    }
    onChangeProps(
      value,
      permissions.find((p) => p._id === value)
    );
  };
  if (viewMode) {
    return options.find((o) => o.value === value)?.label || '-';
  }
  return (
    <CustomSelect showSearch loading={loading} options={options} onChange={onChange} value={value} {...otherProps} />
  );
}

function PermissionSelectWidget(props) {
  const [showElement, setShowElement] = useState(false);

  useEffect(() => {
    setShowElement(true);
  }, []);

  if (!showElement) {
    return null;
  }

  return <Child {...props} />;
}

export default PermissionSelectWidget;
