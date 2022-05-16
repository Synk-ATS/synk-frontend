import { createSlice } from '@reduxjs/toolkit';

const initialState = { drawerOpen: false };

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    closeDrawer: ((state) => ({ ...state, drawerOpen: initialState.drawerOpen })),
    toggleDrawer: (state, action) => ({ ...state, drawerOpen: action.payload }),

  },
});

export const { closeDrawer, toggleDrawer } = globalSlice.actions;

export const selectGlobal = (state) => state.global;

export default globalSlice.reducer;
