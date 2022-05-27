import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER, persistReducer,
} from 'redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { globalSlice } from './slices/global.slice';
import { attendanceSlice } from './slices/attendance.slice';

const attendanceConfig = { key: 'attendance', version: 1, storage };

const synkStore = (preloadedState) => configureStore({
  reducer: combineReducers({
    global: globalSlice.reducer,
    attendance: persistReducer(attendanceConfig, attendanceSlice.reducer),
  }),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
  preloadedState,
});

export default synkStore;
