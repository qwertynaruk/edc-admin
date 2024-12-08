import { Select } from 'antd';

import { FallbackError } from 'components/util-components/fallback-error';

import { useGetPersonnelMeta } from '../../api/get-personnel-meta';

export const PersonnelPrefixSelect = ({ locale = 'th', value, disabled = false, ...selectProps }) => {
  const { data, isLoading, isError } = useGetPersonnelMeta({
    metaType: 'prefix_name_info',
  });

  if (isError) {
    return <FallbackError borderLess />;
  }

  const options = data?.data?.map((item) => ({
    label: item[`name_${locale}`],
    value: item[`name_${locale}`],
  }));

  return (
    <Select
      showSearch
      value={isLoading ? 'กำลังโหลด' : value}
      loading={isLoading}
      disabled={isLoading || disabled}
      style={{ width: '100%' }}
      filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      {...selectProps}
      options={options}
    />
  );
};
