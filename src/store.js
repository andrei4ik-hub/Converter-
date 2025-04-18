import { configureStore } from '@reduxjs/toolkit';
import converterReducer from './converterSlice';

export const store = configureStore({
    reducer: {
        converter: converterReducer,
    },
});
