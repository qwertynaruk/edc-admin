import { useEffect, useState } from 'react';

import { FallbackError } from 'components/util-components/fallback-error';
import { Select } from 'antd';
import { useGetRoles } from 'features/role-management/hooks';

export const PersonnelRoleSelect = ({ locale = 'th', organizationId, value, disabled = false, ...selectProps }) => {
  // const { data, isLoading, isError } = useGetPersonnelMeta({
  //   metaType: 'role_info',
  // });

  const { data, isLoading, isError } = useGetRoles({
    params: {
      limit: 9999,
      page: 1,
      organization_id: organizationId,
    },
  });

  const [optionList, setOptionList] = useState([]);

  useEffect(() => {
    const options = data?.data?.map((item) => ({
      label: item[`name_${locale}`],
      value: item._id,
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
