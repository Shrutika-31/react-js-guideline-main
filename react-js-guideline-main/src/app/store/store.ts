import { configureStore, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  name?: string;
  loggedIn: boolean;
}

const initialState: UserState = { loggedIn: false };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state: UserState, action: PayloadAction<{ name: string }>) {
      state.name = action.payload.name;
      state.loggedIn = true;
    },
    logout(state: UserState) {
      state.name = undefined;
      state.loggedIn = false;
    }
  }
});

export const { login, logout } = userSlice.actions;

const store = configureStore({
  reducer: {
    user: userSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
