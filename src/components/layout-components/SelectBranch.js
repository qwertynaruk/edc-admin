import { Grid, Select } from 'antd';

import UserStore from 'mobx/UserStore';

export default function SelectBranch() {
  const { allBranch, selectBranch, disableChangeBranch } = UserStore;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const onChange = (value) => {
    const findBranch = allBranch.find((branch) => branch.value === value);
    UserStore.ChooseBranch({ chooseBranch: findBranch });
  };

  return (
    <>
      <Select
        style={{ width: screens.lg ? 200 : 150 }}
        // ไปทำต่อใน Q2 ว่าเวลาเปลี่ยน org แล้วจะต้องเปลี่ยน token ด้วยไหม
        // disabled={disableChangeBranch}
        disabled={true}
        showSearch
        optionFilterProp="children"
        onChange={onChange}
        defaultValue={selectBranch?.chooseBranch?.value}
        // onSearch={onSearch}
        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        options={allBranch}
      />
    </>
  );
}
