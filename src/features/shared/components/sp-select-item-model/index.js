import { Select } from 'antd';
import { masterDataKeys } from 'features/shared/keys';
import useHttpClient from 'hooks/useHttpClient';
import { useQuery } from '@tanstack/react-query';

const { Option } = Select;

export function SpSelectItemModel(props) {
  const { data, isLoading } = useSpSelectItemModel();

  return (
    <Select {...props} placeholder="เลือกโมเดล" loading={isLoading}>
      {data?.map((ss, index) => (
        <Option key={index} value={ss.id}>
          {ss.label_en}
        </Option>
      ))}
    </Select>
  );
}

export function useSpSelectItemModel() {
  const { get } = useHttpClient();
  const queryRequest = useQuery({
    queryKey: masterDataKeys.selectModel.queryKey,
    queryFn: async () =>
      await get({
        url: `/master-indices/lost_and_found/model?category_id=1&band_id=2`,
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
