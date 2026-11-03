import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

import { API_BASE_URL } from '../../services/api.js';

export const uploadPhoto = createAsyncThunk(
  'photo/uploadPhoto',
  async (file, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await axios.post(`/photo`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Фото успішно завантажено!');
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Помилка при завантаженні фото.';

      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const photoSlice = createSlice({
  name: 'photo',
  initialState: {
    photoUrl: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(uploadPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(uploadPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.photoUrl = action.payload.data.avatarUrl;

      })

      .addCase(uploadPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default photoSlice.reducer;