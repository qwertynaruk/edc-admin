import useService from 'hooks/useService';
import { useEffect, useMemo, useState } from 'react';
import CaseService from 'services/CaseService';
import { serviceWrapper } from 'utils/serviceHelper';
import CustomSelect from '../CustomSelect';

export function useCaseType() {
  return useService(serviceWrapper(CaseService.get_case_type), () => {
    return {
      params: {
        hotfix: 'case-type-select-widget',
      },
    };
  });
}

function Child(props) {
  const { isViewMode = false, ...otherProps } = props;
  const { data: caseTypes, loading } = useCaseType();
  const options = useMemo(() => {
    if (!caseTypes) return [];
    return caseTypes.map((item) => {
      return {
        key: item._id,
        label: item.name,
        value: item._id,
      };
    });
  }, [caseTypes]);
  const onChange = (value) => {
    if (!props.onChangeProps) {
      return null;
    }
    props.onChangeProps(
      value,
      caseTypes.find((p) => p._id === value)
    );
  };
  if (isViewMode) {
    return options.find((o) => o.value === props.value)?.label || '-';
  }
  return <CustomSelect showSearch loading={loading} options={options} onChange={onChange} {...otherProps} />;
}

export default function CaseTypeSelectWidget(props) {
  const [showElement, setShowElement] = useState(false);

  useEffect(() => {
    setShowElement(true);
  }, []);

  if (!showElement) {
    return null;
  }

  return <Child {...props} />;
}
