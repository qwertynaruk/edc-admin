import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useSearchParamsState = ({ keys = [], defaultValues = [] }) => {
  const [state, setState] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();

  const onChangeParam = ({ keys, values }) => {
    const newState = { ...state };
    keys?.forEach((key, index) => {
      newState[key] = values[index];
    });
    setState(newState);
    setSearchParams(newState);
  };

  useEffect(() => {
    const newState = {};
    keys?.forEach((key, index) => {
      newState[key] = searchParams.get(key) ?? defaultValues?.[index] ?? '';
    });
    setState(newState);
    setSearchParams(newState);
  }, []);

  return [state, onChangeParam];
};
