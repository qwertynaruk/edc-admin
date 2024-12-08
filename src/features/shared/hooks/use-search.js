import { useState } from 'react';
import { useDebounce } from 'react-use';

export const useSearch = ({ initialSearch = '', debounce = 1000 }) => {
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const onSearch = (e) => {
    if (typeof e === 'string') {
      setSearch(e);
      return;
    }

    setSearch(e.target.value);
  };

  useDebounce(
    () => {
      setDebouncedSearch(search);
    },
    debounce,
    [search]
  );

  return {
    search,
    debouncedSearch,
    onSearch,
  };
};
