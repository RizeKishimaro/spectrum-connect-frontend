
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../actions/counterSlice';
import userReducer, { User } from '../actions/userAction';
import overviewReducer from "../actions/overviewSlice"
import phoneReducer from "../actions/phoneSlice"

export interface ReducersTypes {
  counter: unknown,
  user: {
    user: User
  }
  overview: {
    data: any,
    error: any,
    loading: any
  }
}
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    overview: overviewReducer,
    phone: phoneReducer,
  },
});

// Types for dispatch and state 💖
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

