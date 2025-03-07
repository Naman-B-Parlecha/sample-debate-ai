import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem("authToken") || null,
  isAuthenticated: !!localStorage.getItem("authToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("authToken", action.payload);
    },
    clearAuthToken: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("authToken");
    },
  },
});

export const { setAuthToken, clearAuthToken } = authSlice.actions;

export default authSlice.reducer;
