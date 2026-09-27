import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchStudentResults = createAsyncThunk(
  'result/fetchStudentResults',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/student/results');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to fetch results');
    }
  }
);

export const fetchInstructorResults = createAsyncThunk(
  'result/fetchInstructorResults',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/instructor/results');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to fetch instructor results');
    }
  }
);

const resultSlice = createSlice({
  name: 'result',
  initialState: {
    results: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentResults.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudentResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchStudentResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchInstructorResults.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInstructorResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchInstructorResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default resultSlice.reducer;
