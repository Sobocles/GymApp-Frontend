import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './Auth/store/index';
import { usersSlice } from './Admin/store/users/usersSlice'; // Importa desde el index.ts de Users

export const store = configureStore({
  reducer: {
    users: usersSlice.reducer, // Usa usersSlice.reducer de la misma forma que authSlice.reducer
    auth: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

