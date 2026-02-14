import { createSlice } from "@reduxjs/toolkit";

const caseSlice = createSlice({
  name: "cases",

  initialState: {
    caseList: [],
    filterStatus: "All",
  },

  reducers: {
    setCases: (state, action) => {
      state.caseList = action.payload;
    },

    setFilter: (state, action) => {
      state.filterStatus = action.payload;
    },
  },
});

export const { setCases, setFilter } = caseSlice.actions;
export default caseSlice.reducer;
