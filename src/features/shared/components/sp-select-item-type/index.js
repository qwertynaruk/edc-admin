import { Select } from 'antd';
import { masterDataKeys } from 'features/shared/keys';
import useHttpClient from 'hooks/useHttpClient';
import { useQuery } from '@tanstack/react-query';

const { Option } = Select;

export function SpSelectItemType(props) {
  const { data, isLoading } = useSpSelectItemType();

  return (
    <Select {...props} placeholder="เลือกประเภทไอเท็ม" loading={isLoading}>
      {data?.map((ss, index) => (
        <Option key={index} value={ss.id}>
          {ss.label_en}
        </Option>
      ))}
    </Select>
  );
}

export function useSpSelectItemType() {
  const { get } = useHttpClient();
  const queryRequest = useQuery({
    queryKey: masterDataKeys.selectCategory.queryKey,
    queryFn: async () =>
      await get({
        url: `/master-indices/lost_and_found/category`,
      }),
    select: (res) => {
      const { response } = res;
      return response?.data || undefined;
    },
  });

  const lookup = (id = '') => {
    try {
      const finds = queryRequest.data.find((ss) => ss.id === id);
      return finds;
    } catch (error) {
      return null;
    }
  };

  return {
    ...queryRequest,
    lookup,
  };
}
