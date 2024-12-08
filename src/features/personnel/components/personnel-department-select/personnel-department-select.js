import { useEffect, useState } from 'react';

import { FallbackError } from 'components/util-components/fallback-error';
import { Select } from 'antd';
import { useGetPersonnelMeta } from '../../api/get-personnel-meta';

export const PersonnelDepartmentSelect = ({
  locale = 'th',
  organizationId,
  value,
  disabled = false,
  ...selectProps
}) => {
  const { data, isLoading, isError } = useGetPersonnelMeta({
    metaType: 'department_info',
  });

  const [optionList, setOptionList] = useState([]);

  useEffect(() => {
    const options = data?.data
      ?.filter((item) => item?.organization_id === organizationId || !organizationId)
      ?.map((item) => ({
        label: item[`name_${locale}`],
        value: item.id,
      }));
    setOptionList(options);
  }, [data?.data, locale, organizationId]);

  if (isError) {
    return <FallbackError borderLess />;
  }

  return (
    <Select
      showSearch
      value={isLoading ? 'กำลังโหลด' : value}
      loading={isLoading}
      disabled={isLoading || disabled}
      style={{ width: '100%' }}
      filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      {...selectProps}
      options={optionList}
    />
  );
};
