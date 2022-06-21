import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  attendance: {
    course: null,
    faculty: null,
    date: null,
    content: null,
    open: false,
  },
};

export const attendanceSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    addAttendance: (state, action) => ({ ...state, attendance: action.payload }),
    openAttendance: (state, action) => ({ ...state, attendance: { open: action.payload } }),
    closeAttendance: () => ({ attendance: initialState.attendance }),
  },
});

export const selectAttendance = (state) => state.attendance;

export default attendanceSlice.reducer;
