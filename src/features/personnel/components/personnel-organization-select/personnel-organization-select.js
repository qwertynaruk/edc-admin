import { useEffect, useState } from 'react';

import { FallbackError } from 'components/util-components/fallback-error';
import { Select } from 'antd';
import { useGetPersonnelMeta } from '../../api/get-personnel-meta';

export const PersonnelOrganizationSelect = ({ locale = 'th', value, disabled = false, ...selectProps }) => {
  const { data, isLoading, isError } = useGetPersonnelMeta({
    metaType: 'organization_info',
  });

  const [optionList, setOptionList] = useState([]);

  useEffect(() => {
    const options = data?.data?.map((item) => ({
      label: item[`full_name_${locale}`],
      value: item.id,
    }));
    setOptionList(options);
  }, [data?.data, locale]);

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
