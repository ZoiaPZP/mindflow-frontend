import { createSlice } from '@reduxjs/toolkit';
import { login, logout, refreshUser, register } from './operations';
import { uploadPhoto } from '../uploadPhoto/photoSlice.js';
import toast from 'react-hot-toast';
import { setAuthHeader, removeAuthHeader } from '../../services/api';

const initialState = {
  user: {
    id: null,
    name: null,
    email: null,
    avatarUrl: null,
    savedArticles: [],
    articlesAmount: 0,
    role: 'user',
  },
  accessToken: null,
  isLoggedIn: false,
  isRefreshing: false,
};

const cleanUser = (user) => ({
  id: user?._id || null,
  name: user?.name || null,
  email: user?.email || null,
  avatarUrl: user?.avatarUrl || null,
  savedArticles: user?.savedArticles || [],
  articlesAmount: user?.articlesAmount || 0,
  role: user?.role || 'user',
});

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      Object.assign(state, initialState);
      removeAuthHeader();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.user = cleanUser(action.payload.user);
        state.accessToken = action.payload.accessToken;
        state.isLoggedIn = true;
        setAuthHeader(action.payload.accessToken);
        toast.success('Registration complete! You are now logged in.');
      })
      .addCase(register.rejected, (_, action) => {
        toast.error(action.payload || 'Registration failed');
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = cleanUser(action.payload.user);
        state.accessToken = action.payload.accessToken;
        state.isLoggedIn = true;
        setAuthHeader(action.payload.accessToken);
        toast.success('Login complete!');
      })
      .addCase(login.rejected, (_, action) => {
        toast.error(action.payload || 'Login failed');
      })
      .addCase(logout.fulfilled, () => {
        removeAuthHeader();
        toast.success('You have been logged out.');
        return initialState;
      })
      .addCase(logout.rejected, () => {
        removeAuthHeader();
        toast.error('Logout failed, but you have been logged out locally.');
        return initialState;
      })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        const avatarUrl = action.payload?.data?.avatarUrl;
        if (avatarUrl) state.user.avatarUrl = avatarUrl;
      })
      .addCase(refreshUser.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.isRefreshing = false;
        if (action.payload?.user && action.payload?.accessToken) {
          state.user = cleanUser(action.payload.user);
          state.accessToken = action.payload.accessToken;
          state.isLoggedIn = true;
          setAuthHeader(action.payload.accessToken);
        } else {
          toast.error('Session refresh failed. Please login again.');
        }
      })
      .addCase(refreshUser.rejected, (state) => {
        state.isRefreshing = false;
        state.isLoggedIn = false;
        state.accessToken = null;
        state.user = initialState.user;
        removeAuthHeader();
        toast.error('Session expired. Please login again.');
      });
  },
});

export const { clearAuth } = slice.actions;
export default slice.reducer;