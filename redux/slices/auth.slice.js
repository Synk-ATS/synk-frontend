import { createSlice } from '@reduxjs/toolkit';

export const USER_TYPE = {
  teacher: 0,
  student: 1,
};

const initialState = {
  userType: USER_TYPE.admin,
  profile: {},
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
    setProfile: (state, action) => ({
      ...state, profile: action.payload,
    }),
  },
});

export const { getUserInfo, setSignInType, setProfile } = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
