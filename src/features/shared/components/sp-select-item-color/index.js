import { Select } from 'antd';
import { masterDataKeys } from 'features/shared/keys';
import useHttpClient from 'hooks/useHttpClient';
import { useQuery } from '@tanstack/react-query';

const { Option } = Select;

export function SpSelectItemColor(props) {
  const { data, isLoading } = useSpSelectItemColor();

  return (
    <Select {...props} placeholder="เลือกสี" loading={isLoading}>
      {data?.map((ss, index) => (
        <Option key={index} value={ss.id}>
          {ss.label_en}
        </Option>
      ))}
    </Select>
  );
}

export function useSpSelectItemColor() {
  const { get } = useHttpClient();
  const queryRequest = useQuery({
    queryKey: masterDataKeys.selectColor.queryKey,
    queryFn: async () =>
      await get({
        url: `/master-indices/attribute?attribute_type_id=1`,
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
