import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SearchState = {
  records: any[];
  totalRecords: number;
  page: number;
  record: any | null;
}

const initialState: SearchState = {
  records: [],
  totalRecords: 0,
  page: 1,
  record: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setRecords(state, action: PayloadAction<any[]>) {
      state.records = action.payload;
    },
    setTotalRecords(state, action: PayloadAction<number>) {
      state.totalRecords = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setRecord(state, action: PayloadAction<any | null>) {
      state.record = action.payload;
    },
    resetSearchState(state) {
      state.records = [];
      state.totalRecords = 0;
      state.page = 1;
      state.record = null;
    },
  },
});

export const { setRecords, setTotalRecords, setPage, setRecord, resetSearchState } = searchSlice.actions;

export default searchSlice.reducer;
