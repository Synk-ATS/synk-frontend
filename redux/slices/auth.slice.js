import { createSlice } from '@reduxjs/toolkit';

const USER_TYPE = {
  admin: 0,
  faculty: 1,
  student: 2,
};

const initialState = {
  userType: USER_TYPE.admin,
  userInfo: {
    uid: '',
    userType: USER_TYPE.admin,
    email: '',
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    getUserInfo: (state, action) => ({
      ...state, userInfo: action.payload,
    }),
    setSignInType: (state, action) => ({
      ...state, userType: action.payload,
    }),
  },
});

export const { getUserInfo, setSignInType } = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
