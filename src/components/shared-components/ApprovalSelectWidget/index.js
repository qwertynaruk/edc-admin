import useService from 'hooks/useService';
import _ from 'lodash';
import { useMemo } from 'react';
import RoleService from 'services/RoleService';
import { serviceWrapper } from 'utils/serviceHelper';
import CustomSelect from '../CustomSelect';

export default function ApprovalSelectWidget(props) {
  const { value, ...rest } = props;
  const { data, loading } = useService(serviceWrapper(RoleService.getApproval));
  const options = useMemo(() => {
    if (!data) return [];
    return data.map((item) => {
      return {
        label: item.approve_level,
        value: item._id,
      };
    });
  }, [data]);
  if (!data || loading) return <CustomSelect loading={loading} />;
  return (
    <CustomSelect
      loading={loading}
      options={options}
      placeholder="กรุณาเลือกระดับการอนุมัติ"
      value={_.get(value, '_id', value)}
      {...rest}
    />
  );
}
