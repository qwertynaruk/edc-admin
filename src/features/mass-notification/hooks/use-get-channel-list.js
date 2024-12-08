const options = [
  { value: 'one_life', label: 'OneLife' },
  { value: 'mail', label: 'Mail' },
  { value: 'line', label: 'Line' },
  { value: 'sms', label: 'SMS' },
];

export function useGetChannelList() {
  const data = options;
  return {
    data,
  };
}
