// src/store/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../../Interfaces/AuthState';
import { UserInterface } from '../../Interfaces/UserInterface';



const initialState: AuthState = {
  status: 'not-authenticated',
  user: null,
  isAuth: false,
  isAdmin: false,
  trainer: false,
  roles: [],
  token: null,
  errorMessage: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    onChecking: (state) => {
      state.status = 'checking';
      state.user = null;
      state.isAuth = false;
      state.isAdmin = false;
      state.trainer = false;
      state.roles = [];
      state.errorMessage = undefined;
    },
    onLogin: (state, { payload }) => {
      state.status = 'authenticated';
      state.user = payload.user;
      state.isAuth = true;
      state.isAdmin = payload.isAdmin;
      state.trainer = payload.trainer;
      state.roles = payload.roles;
      state.token = payload.token; // Agrega esta línea
      state.errorMessage = undefined;
    },
    onLogout: (state) => {
      state.status = 'not-authenticated';
      state.user = null;
      state.isAuth = false;
      state.isAdmin = false;
      state.trainer = false;
      state.roles = [];
      state.errorMessage = undefined;
    },
    clearErrorMessage: (state) => {
      state.errorMessage = undefined;
    },
    updateProfile: (state, { payload }: PayloadAction<UserInterface>) => {
      if (state.user && state.user.id === payload.id) {
        state.user = payload;
        state.isAdmin = payload.admin;
        state.trainer = payload.trainer;
        state.roles = payload.roles ? payload.roles.map(role => role.authority) : [];
      }
    },
  },
});

export const { onChecking, onLogin, onLogout, clearErrorMessage, updateProfile } = authSlice.actions;
export default authSlice.reducer;
