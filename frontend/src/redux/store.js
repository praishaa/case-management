import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import caseReducer from "./caseSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cases: caseReducer,
  },
});
