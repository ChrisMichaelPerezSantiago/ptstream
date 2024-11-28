import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UniqueSerieSeason } from "../../types";

type SearchState = {
  seasonSelected: UniqueSerieSeason | null;
}

const initialState: SearchState = {
  seasonSelected: null,
};

const searchSlice = createSlice({
  name: "season",
  initialState,
  reducers: {
    setSeasonSelected(state, action: PayloadAction<UniqueSerieSeason | null>) {
      state.seasonSelected = action.payload;
    },
    clearSeasonSelected(state) {
      state.seasonSelected = null;
    },
  },
});

export const { setSeasonSelected, clearSeasonSelected } = searchSlice.actions;

export default searchSlice.reducer;
