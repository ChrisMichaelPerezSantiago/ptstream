import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Scene } from '../../types';


type SceneState = {
  currentScene: Scene;
}

const initialState: SceneState = {
  currentScene: "series",
};

const sceneSlice = createSlice({
  name: 'scene',
  initialState,
  reducers: {
    setScene: (state, action: PayloadAction<Scene>) => {
      state.currentScene = action.payload;
    },
  },
});

export const { setScene } = sceneSlice.actions;

export default sceneSlice.reducer;
