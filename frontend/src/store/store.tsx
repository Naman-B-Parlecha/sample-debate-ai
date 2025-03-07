import { configureStore } from "@reduxjs/toolkit";
import AuthReducers from "../context/AuthContext.tsx";

const store = configureStore({
  reducer: {
    auth: AuthReducers,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;