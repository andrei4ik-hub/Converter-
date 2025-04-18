import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchCurrencies = createAsyncThunk("converter/fetchCurrencies", async () => {
    const response = await axios.post("http://localhost:3000/api/get-start-data", {
        abbreviations: ["BYN", "USD", "EUR", "RUB", "PLN", "CNY"],
    });
    return response.data;
});

export const updateCurrency = createAsyncThunk("converter/updateCurrency", async ({ abbreviation, rate }) => {
    const response = await axios.post("http://localhost:3000/api/update-currency", {
        abbreviation,
        rate,
    });
    return response.data;
});

const converterSlice = createSlice({
    name: "converter",
    initialState: {
        currencies: [], 
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrencies.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCurrencies.fulfilled, (state, action) => {
                state.loading = false;
                state.currencies = action.payload;
            })
            .addCase(fetchCurrencies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateCurrency.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCurrency.fulfilled, (state, action) => {
                state.loading = false;
                state.currencies = action.payload;
            })
            .addCase(updateCurrency.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default converterSlice.reducer;
