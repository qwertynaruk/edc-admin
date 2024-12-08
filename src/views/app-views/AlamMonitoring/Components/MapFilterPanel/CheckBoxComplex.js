import { Checkbox } from 'antd';
import { useState } from 'react';

const CheckBoxComplex = ({ options = [], checkedList, onSelectOption }) => {
  const [checkAll, setCheckAll] = useState(false);

  const handleCheckAllChange = (el) => {
    const _target = el.target.checked;
    if (_target) {
      setCheckAll(true);
      handleSelectOption(options.map((element) => element.value));
    } else {
      setCheckAll(false);
      handleSelectOption([]);
    }
  };

  const handleSelectOption = (target) => {
    if (options.length !== target.length) {
      setCheckAll(false);
    }

    onSelectOption(target);
  };

  return (
    <>
      <Checkbox onChange={handleCheckAllChange} checked={checkAll}>
        เลือกทั้งหมด
      </Checkbox>
      <Checkbox.Group
        style={{ display: 'flex', flexDirection: 'column', lineHeight: 2 }}
        options={options}
        value={checkedList}
        onChange={handleSelectOption}
      />
    </>
  );
};

export default CheckBoxComplex;
