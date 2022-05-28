import { createSlice } from '@reduxjs/toolkit';

const initialState = { };

export const attendanceSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {},
});

export const selectAttendance = (state) => state.attendance;

export default attendanceSlice.reducer;
