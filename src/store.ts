import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './Auth/store/index';
import { usersSlice } from './Admin/store/users/usersSlice'; 
import cartReducer from './Store/Store/slices/cartSlice'; 

export const store = configureStore({
  reducer: {
    users: usersSlice.reducer, 
    auth: authSlice.reducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

