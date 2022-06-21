import { createSlice } from '@reduxjs/toolkit';

const initialState = { drawerOpen: false, toastMessage: null };

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    closeDrawer: ((state) => ({ ...state, drawerOpen: initialState.drawerOpen })),
    toggleDrawer: (state, action) => ({ ...state, drawerOpen: action.payload }),
    setToast: (state, action) => ({ ...state, toastMessage: action.payload }),
    clearToast: (state) => ({ ...state, toastMessage: initialState.toastMessage }),
  },
});

export const {
  closeDrawer, toggleDrawer, setToast, clearToast,
} = globalSlice.actions;

export const selectGlobal = (state) => state.global;

export default globalSlice.reducer;
