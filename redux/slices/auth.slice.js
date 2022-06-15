import { createSlice } from '@reduxjs/toolkit';

export const USER_TYPE = {
  faculty: 0,
  student: 1,
};

const initialState = {
  userType: null,
  profile: {},
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSignInType: (state, action) => ({
      ...state, userType: action.payload,
    }),
    setProfile: (state, action) => ({
      ...state, profile: action.payload,
    }),
  },
});

export const { setSignInType, setProfile } = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
