// import { createSlice } from "@reduxjs/toolkit";

// const assignmentSlice = createSlice({
//   name: "assignment",
//   initialState: {
//     assignment: [],  // empty array initially
//   },
//   reducers: {
//     setAssign: (state, action) => {
//       state.assignment = action.payload;
//     },
//   },
// });

// export default assignmentSlice.reducer;
// export const { setAssign } = assignmentSlice.actions;




import { createSlice } from "@reduxjs/toolkit";

const assignmentSlice = createSlice({
  name: "assignment",
  initialState: {
    assignment: [], // empty array initially
  },
  reducers: {
    // Existing reducer
    setAssign: (state, action) => {
      state.assignment = action.payload;
    },

    // New reducer to update a single assignment field
    updateAssignment: (state, action) => {
      const { serialNumber, field, value } = action.payload;
      state.assignment = state.assignment.map((item) =>
        item.serialNumber === serialNumber
          ? { ...item, [field]: value }
          : item
      );
    },
  },
});

export default assignmentSlice.reducer;
export const { setAssign, updateAssignment } = assignmentSlice.actions;
