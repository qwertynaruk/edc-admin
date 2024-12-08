import { Select } from 'antd';

export function OneforceSelection(props) {
  const {
    optionProps = { data: [], dataValue: '', dataLabel: '' },
    selectProps = { placeholder: '', loading: false },
    ...rest
  } = props;

  const options = optionProps.data?.map((ss) => ({
    label: ss?.[optionProps.dataLabel] || '',
    value: ss?.[optionProps.dataValue] || '',
  }));

  return <Select {...selectProps} options={options} {...rest} />;
}
