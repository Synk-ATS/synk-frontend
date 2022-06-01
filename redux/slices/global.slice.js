import { createSlice } from '@reduxjs/toolkit';

const initialState = { drawerOpen: false, profile: null };

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    closeDrawer: ((state) => ({ ...state, drawerOpen: initialState.drawerOpen })),
    toggleDrawer: (state, action) => ({ ...state, drawerOpen: action.payload }),
    getProfile: (state, action) => ({ ...state, profile: action.payload }),
  },
});

export const { closeDrawer, toggleDrawer, getProfile } = globalSlice.actions;

export const selectGlobal = (state) => state.global;

export default globalSlice.reducer;
