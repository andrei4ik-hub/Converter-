import { configureStore } from '@reduxjs/toolkit';
import converterReducer from './slices/converterSlice';
import dropdownReducer from './slices/dropDownSlice'; 

export const store = configureStore({
    reducer: {
        converter: converterReducer,
        dropdown: dropdownReducer, 
    },
});
