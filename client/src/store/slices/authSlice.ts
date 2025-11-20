import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "../../lib/types/reduxTypes";

const initialState: AuthState = {
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      localStorage.setItem("accessToken", state.accessToken);
    },
    logout: (state) => {
      state.accessToken = null;
      localStorage.setItem("accessToken", state.accessToken as any);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
