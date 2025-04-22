import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import currencyData from "../initialValutes.json";
import { fetchCurrencies, updateCurrency } from "../api/apiClient";


export const fetchCurrenciesThunk = createAsyncThunk("converter/fetchCurrencies", async () => {
    const response = await fetchCurrencies(currencyData.abbreviations);
    console.log("data:",response)
    return response;
});

export const updateCurrencyThunk = createAsyncThunk("converter/updateCurrency", async ({ abbreviation, rate }) => {
    const response = await updateCurrency(abbreviation, rate);
    return response;
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
                .addCase(fetchCurrenciesThunk.pending, (state) => {
                    state.loading = true;
                })
                .addCase(fetchCurrenciesThunk.fulfilled, (state, action) => {
                    state.loading = false;
                    state.currencies = action.payload;
                })
                .addCase(fetchCurrenciesThunk.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.error.message;
                })
                .addCase(updateCurrencyThunk.pending, (state) => {
                    state.loading = true;
                })
                .addCase(updateCurrencyThunk.fulfilled, (state, action) => {
                    state.loading = false;
                    state.currencies = action.payload;
                })
                .addCase(updateCurrencyThunk.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.error.message;
                });
        },
    });

export default converterSlice.reducer;
