import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';

import sceneReducer from './scenes/sceneSlice';
import genreReducer from './genre/genreSlice';

const logger = createLogger({
  collapsed: true,
  duration: true,
  diff: true,
})

export const store = configureStore({
  reducer: {
    scene: sceneReducer,
    genre: genreReducer,

  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;