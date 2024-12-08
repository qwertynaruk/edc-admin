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
  const { viewMode, onChange: onChangeProps, ...otherProps } = props;
  const { data: m = {}, loading } = useService(serviceWrapper(PersonnelService.getLeader), () => {
    return {
      params: {
        hotfix: 'approver-select-widget',
        department_id: getID(props.department),
        position_id: getID(props.position),
        personnel_id: getID(props.personnel),
      },
    };
  });
  const { personnel_in_position: pip = [], personnel_on_duty: pod = [] } = m;
  const managers = _.compact([...pip, ...pod]);
  const options = useMemo(() => {
    if (!managers) return [];
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
  return <CustomSelect showSearch loading={loading} options={options} onChange={onChange} {...otherProps} />;
}

export default function ApproverSelectWidget(props) {
  const [showElement, setShowElement] = useState(false);

  useEffect(() => {
    setShowElement(true);
  }, []);

  if (!showElement) {
    return null;
  }

  return <Child {...props} />;
}
