import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type GenreState = {
  selectedGenre: number | null;
}

const initialState: GenreState = {
  selectedGenre: null,
};

const genreSlice = createSlice({
  name: 'genre',
  initialState,
  reducers: {
    setGenre: (state, action: PayloadAction<number | null>) => {
      state.selectedGenre = action.payload;
    },
    resetGenre: (state) => {
      state.selectedGenre = null;
    },
  },
});

export const { setGenre, resetGenre } = genreSlice.actions;

export default genreSlice.reducer;
