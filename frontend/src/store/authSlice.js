import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

const userFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;
const tokenFromStorage = localStorage.getItem('token') || null;

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const data = response.data.data;
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (err) {
      const resData = err.response?.data;
      if (resData) {
        if (resData.errors && typeof resData.errors === 'object' && Object.keys(resData.errors).length > 0) {
          return rejectWithValue(Object.values(resData.errors).join(', '));
        }
        if (resData.message) {
          return rejectWithValue(resData.message);
        }
        if (resData.error) {
          return rejectWithValue(resData.error);
        }
      }
      return rejectWithValue(err.message || 'Login failed. Invalid credentials.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      const resData = err.response?.data;
      if (resData) {
        if (resData.errors && typeof resData.errors === 'object' && Object.keys(resData.errors).length > 0) {
          return rejectWithValue(Object.values(resData.errors).join(', '));
        }
        if (resData.message) {
          return rejectWithValue(resData.message);
        }
        if (resData.error) {
          return rejectWithValue(resData.error);
        }
      }
      return rejectWithValue(err.message || 'Registration failed.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage,
    token: tokenFromStorage,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
