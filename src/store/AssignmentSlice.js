import { createSlice } from "@reduxjs/toolkit";

const assignmentSlice = createSlice({
  name: "assignment",
  initialState: {
    assignment: [], // all data stored here
  },
  reducers: {
    setAssign: (state, action) => {
      state.assignment = action.payload;
    },
    updateAssignment: (state, action) => {
      const { serialNumber, field, value } = action.payload;
      state.assignment = state.assignment.map(item =>
        item.serialNumber === serialNumber ? { ...item, [field]: value } : item
      );
    },
  },
});

export default assignmentSlice.reducer;
export const { setAssign, updateAssignment } = assignmentSlice.actions;
