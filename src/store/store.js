import { configureStore } from "@reduxjs/toolkit";
import user from "./userSlice"
import assignment from "./AssignmentSlice"

const store=configureStore({
    reducer:{
        user,
        assignment
    }
})

export default store