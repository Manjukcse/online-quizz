import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchAllUsers = createAsyncThunk(
  'user/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/admin/users');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to fetch users');
    }
  }
);

export const fetchPendingInstructors = createAsyncThunk(
  'user/fetchPendingInstructors',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/admin/instructors/pending');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to fetch pending instructors');
    }
  }
);

export const approveInstructor = createAsyncThunk(
  'user/approveInstructor',
  async ({ id, approve, salary }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/admin/instructors/${id}/approve`, { approve, salary });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to update instructor status');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/users/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to delete user');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    pendingInstructors: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchPendingInstructors.fulfilled, (state, action) => {
        state.pendingInstructors = action.payload;
      })
      .addCase(approveInstructor.fulfilled, (state, action) => {
        state.pendingInstructors = state.pendingInstructors.filter(i => i.id !== action.payload.id);
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
