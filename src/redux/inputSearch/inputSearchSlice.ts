import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InputSearchState = {
  query: string;
}

const initialState: InputSearchState = {
  query: '',
};

const inputSearchSlice = createSlice({
  name: 'inputSearch',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    clearSearchQuery(state) {
      state.query = '';
    },
  },
});

export const { setSearchQuery, clearSearchQuery } = inputSearchSlice.actions;

export default inputSearchSlice.reducer;
