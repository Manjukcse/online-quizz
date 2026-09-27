import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchStudentExams = createAsyncThunk(
  'exam/fetchStudentExams',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/student/exams');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to fetch exams');
    }
  }
);

export const fetchInstructorExams = createAsyncThunk(
  'exam/fetchInstructorExams',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/instructor/exams');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to fetch instructor exams');
    }
  }
);

export const registerForExam = createAsyncThunk(
  'exam/registerForExam',
  async (examId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/student/exams/${examId}/register`);
      return { examId, data: res.data.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data?.error || err.message || 'Registration failed');
    }
  }
);

export const startExamAttempt = createAsyncThunk(
  'exam/startExamAttempt',
  async (examId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/student/exams/${examId}/start`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data?.error || err.message || 'Unable to start exam');
    }
  }
);

export const submitExamAttempt = createAsyncThunk(
  'exam/submitExamAttempt',
  async (submitData, { rejectWithValue }) => {
    try {
      const res = await api.post('/student/exams/submit', submitData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data?.error || err.message || 'Submission failed');
    }
  }
);

const examSlice = createSlice({
  name: 'exam',
  initialState: {
    exams: [],
    currentExamAttempt: null,
    lastSubmittedResult: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAttempt: (state) => {
      state.currentExamAttempt = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentExams.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = action.payload;
      })
      .addCase(fetchStudentExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchInstructorExams.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInstructorExams.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = action.payload;
      })
      .addCase(registerForExam.fulfilled, (state, action) => {
        const exam = state.exams.find((e) => e.id === action.payload.examId);
        if (exam) {
          exam.isRegistered = true;
        }
      })
      .addCase(startExamAttempt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startExamAttempt.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExamAttempt = action.payload;
      })
      .addCase(startExamAttempt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitExamAttempt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitExamAttempt.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSubmittedResult = action.payload;
        state.currentExamAttempt = null;
      })
      .addCase(submitExamAttempt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAttempt, clearError } = examSlice.actions;
export default examSlice.reducer;
