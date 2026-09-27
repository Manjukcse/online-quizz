import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import examReducer from './examSlice';
import resultReducer from './resultSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exam: examReducer,
    result: resultReducer,
    user: userReducer,
  },
});
