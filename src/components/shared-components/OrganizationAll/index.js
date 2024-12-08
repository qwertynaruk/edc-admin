import { useMemo, useState } from 'react';

import PersonnelService from 'services/PersonelService';
import { Select } from 'antd';
import UserStore from 'mobx/UserStore';
import { mapOrgTreeToOneLevle } from 'utils/OrganizationHelper';

const defaultFilter = 'all';

const OrganizationAll = ({ onChageOrganization = () => {} }) => {
  const { user, organization } = UserStore;
  const [selectOrganization, setSelectOrganization] = useState(defaultFilter);

  const { data: organizationTreeList, isLoading: isLoadinGorganizationTreeList } =
    PersonnelService.useGetOrgnanizationTree({
      queryParams: { org_level: 9999, organization: organization?.db_name },
    });

  const organizationList = useMemo(() => mapOrgTreeToOneLevle(organizationTreeList, true), [organizationTreeList]);

  return (
    <>
      <Select
        style={{
          width: 200,
        }}
        defaultValue={defaultFilter}
        allowClear
        showSearch
        onChange={(value) => {
          setSelectOrganization(value);
          onChageOrganization?.(value);
        }}
        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        options={[
          {
            label: 'ทั้งหมด',
            value: defaultFilter,
          },
          ...organizationList,
        ]}
      />
    </>
  );
};

export default OrganizationAll;
