import useService from 'hooks/useService';
import { useEffect, useMemo, useState } from 'react';
import CaseService from 'services/CaseService';
import { serviceWrapper } from 'utils/serviceHelper';
import CustomSelect from '../CustomSelect';

export function useWorkflows(f = () => {}) {
  return useService(serviceWrapper(CaseService.getWorkflows), f());
}

function Child(props) {
  const { isViewMode = false, options: serviceOptions = {}, ...otherProps } = props;
  const { data: workflows, loading } = useWorkflows(() => {
    return serviceOptions;
  });
  const options = useMemo(() => {
    if (!workflows) return [];
    return workflows.map((item) => {
      return {
        key: item._id,
        label: item.name,
        value: item._id,
      };
    });
  }, [workflows]);
  const onChange = (value) => {
    if (!props.onChangeProps) {
      return null;
    }
    props.onChangeProps(
      value,
      workflows.find((p) => p._id === value)
    );
  };
  if (isViewMode) {
    return options.find((o) => o.value === props.value)?.label || '-';
  }
  return <CustomSelect showSearch loading={loading} options={options} onChange={onChange} {...otherProps} />;
}

export default function WorkflowSelectWidget(props) {
  const [showElement, setShowElement] = useState(false);

  useEffect(() => {
    setShowElement(true);
  }, []);

  if (!showElement) {
    return null;
  }

  return <Child {...props} />;
}
