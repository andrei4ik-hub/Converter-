import { createSlice } from "@reduxjs/toolkit";

const dropdownSlice = createSlice({
    name: "dropdown",
    initialState: {
        isVisible: false,
    },
    reducers: {
        showDropdown: (state) => {
            state.isVisible = true;
        },
        hideDropdown: (state) => {
            state.isVisible = false;
        },
    },
});

export const { showDropdown, hideDropdown } = dropdownSlice.actions;
export default dropdownSlice.reducer;
