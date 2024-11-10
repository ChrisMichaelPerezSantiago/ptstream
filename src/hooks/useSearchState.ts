import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../redux/store";
import {
  resetSearchState,
  setPage,
  setRecord,
  setRecords,
  setTotalRecords,
} from "../redux/search/searchSlice";
import {
  clearSearchQuery,
  setSearchQuery,
} from "../redux/inputSearch/inputSearchSlice";

// Define mappings for actions and selectors
const actionMap = {
  records: setRecords,
  totalRecords: setTotalRecords,
  page: setPage,
  record: setRecord,
  inputValue: setSearchQuery,
} as const;

const selectorMap = {
  records: (state: RootState) => state.search.records,
  totalRecords: (state: RootState) => state.search.totalRecords,
  page: (state: RootState) => state.search.page,
  record: (state: RootState) => state.search.record,
  inputValue: (state: RootState) => state.inputSearch.query,
} as const;

// Define SearchStateKey to distinguish inputValue from search state keys
type SearchStateKey = keyof typeof actionMap;

// Define SearchStateValue based on key type
type SearchStateValue<T extends SearchStateKey> =
  T extends 'inputValue' ? string : RootState['search'][Extract<T, keyof RootState['search']>];

type SearchStateBuilder = {
  get: <T extends SearchStateKey>(key: T) => SearchStateValue<T>;
  set: <T extends SearchStateKey>(key: T, value: SearchStateValue<T>) => void;
  clear: () => void;
};

const useSearchState = (): SearchStateBuilder => {
  const dispatch = useDispatch();

  const get = useCallback(
    <T extends SearchStateKey>(key: T): SearchStateValue<T> => {
      return useSelector(selectorMap[key]) as SearchStateValue<T>;
    },
    []
  );

  const set = useCallback(
    <T extends SearchStateKey>(key: T, value: SearchStateValue<T>) => {
      const action = actionMap[key];
      if (action) dispatch(action(value));
    },
    [dispatch]
  );

  const clear = useCallback(() => {
    dispatch(resetSearchState());
    set("records", []);
    set("totalRecords", 0);
    set("page", 1);
    set("record", null);
    dispatch(clearSearchQuery());
  }, [dispatch, set]);

  return { get, set, clear };
};

export default useSearchState;
