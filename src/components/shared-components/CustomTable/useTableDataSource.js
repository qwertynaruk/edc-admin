import produce from 'immer';
import { useCallback, useReducer } from 'react';

const ACTION = {
  SET_DATA_SOURCE: 'SET_DATA_SOURCE',
  SET_CURRENT_DATA_SOURCE: 'SET_CURRENT_DATA_SOURCE',
  SET_EXPORT_DATA_SOURCE: 'SET_EXPORT_DATA_SOURCE',
};

const init = (config = {}) => {
  return {
    dataSource: [],
    currentDataSource: [],
    exportDataSource: [],
    ...config,
  };
};
const reducer = produce((state, action) => {
  switch (action.type) {
    case ACTION.SET_DATA_SOURCE:
      state.dataSource = action.payload;
      state.currentDataSource = action.payload;
      state.exportDataSource = action.payload;
      break;
    case ACTION.SET_CURRENT_DATA_SOURCE:
      state.currentDataSource = action.payload;
      state.exportDataSource = action.payload;
      break;
    case ACTION.SET_EXPORT_DATA_SOURCE:
      state.exportDataSource = action.payload;
      break;
    default:
      break;
  }
});
export const useTableDataSource = (initialDataSource = []) => {
  const [state, dispatch] = useReducer(
    reducer,
    init({
      dataSource: initialDataSource,
      currentDataSource: initialDataSource,
      exportDataSource: initialDataSource,
    }),
    init
  );

  const setDataSource = useCallback((payload) => {
    dispatch({
      type: ACTION.SET_DATA_SOURCE,
      payload,
    });
  }, []);
  const setCurrentDataSource = useCallback((payload) => {
    dispatch({
      type: ACTION.SET_CURRENT_DATA_SOURCE,
      payload,
    });
  }, []);
  const setExportDataSource = useCallback((payload) => {
    dispatch({
      type: ACTION.SET_EXPORT_DATA_SOURCE,
      payload,
    });
  }, []);
  return {
    ...state,
    dispatch,
    setDataSource,
    setCurrentDataSource,
    setExportDataSource,
  };
};

export default useTableDataSource;
