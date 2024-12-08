import { Select } from 'antd';
import { masterDataKeys } from 'features/shared/keys';
import useHttpClient from 'hooks/useHttpClient';
import { useQuery } from '@tanstack/react-query';

const { Option } = Select;

export function SpSelectItemBrand(props) {
  const { data, isLoading } = useSpSelectItemBrand();

  return (
    <Select {...props} placeholder="เลือกแบรนด์" loading={isLoading}>
      {data?.map((ss, index) => (
        <Option key={index} value={ss.id}>
          {ss.label_en}
        </Option>
      ))}
    </Select>
  );
}

export function useSpSelectItemBrand() {
  const { get } = useHttpClient();
  const queryRequest = useQuery({
    queryKey: masterDataKeys.selectBrand.queryKey,
    queryFn: async () =>
      await get({
        url: `/master-indices/lost_and_found/brand`,
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
