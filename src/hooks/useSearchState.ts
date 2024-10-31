import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../redux/store";
import { resetSearchState, setPage, setRecord, setRecords, setTotalRecords } from "../redux/search/searchSlice";
import { setSearchQuery } from "../redux/inputSearch/inputSearchSlice";

const useSearchState = () => {
  const dispatch = useDispatch();

  const records = useSelector((state: RootState) => state.search.records);
  const totalRecords = useSelector((state: RootState) => state.search.totalRecords);
  const page = useSelector((state: RootState) => state.search.page);
  const record = useSelector((state: RootState) => state.search.record);
  const inputValue = useSelector((state: RootState) => state.inputSearch.query);

  const updateRecords = useCallback(
    (newRecords: any[]) => dispatch(setRecords(newRecords)),
    [dispatch]
  );

  const updateTotalRecords = useCallback(
    (newTotal: number) => dispatch(setTotalRecords(newTotal)),
    [dispatch]
  );

  const updatePage = useCallback(
    (newPage: number) => dispatch(setPage(newPage)),
    [dispatch]
  );

  const updateRecord = useCallback(
    (newRecord: any | null) => dispatch(setRecord(newRecord)),
    [dispatch]
  );

  const updateSearchQuery = useCallback(
    (newQuery: string) => dispatch(setSearchQuery(newQuery)),
    [dispatch]
  );

  const clearSearchState = useCallback(() => {
    dispatch(resetSearchState());
    updateRecords([]);
    updateTotalRecords(0);
    updatePage(1);
    updateRecord(null);
  }, [dispatch]);

  return {
    records,
    totalRecords,
    page,
    record,
    inputValue,
    updateRecords,
    updateTotalRecords,
    updatePage,
    updateRecord,
    updateSearchQuery,
    clearSearchState,
  };
};

export default useSearchState;
