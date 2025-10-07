import { configureStore } from '@reduxjs/toolkit';
import airportReducer from './slices/airportSlice';

export const store = configureStore({
  reducer: {
    airports: airportReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;