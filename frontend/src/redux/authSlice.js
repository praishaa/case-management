import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",

  initialState: {
    currentUser: null,
    role: null,
  },

  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload.user;
      state.role = action.payload.role;
    },

    clearUser: (state) => {
      state.currentUser = null;
      state.role = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
