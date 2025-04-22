import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCurrencies, updateCurrency } from "../api/apiClient";


const initialCurrencies = ["BYN", "USD", "EUR", "RUB", "PLN","CNY","TRY"];

export const fetchCurrenciesThunk = createAsyncThunk("converter/fetchCurrencies", async () => {
    const response = await fetchCurrencies(initialCurrencies);
    return response;
});

export const updateCurrencyThunk = createAsyncThunk("converter/updateCurrency", async ({ abbreviation, rate, currencies }) => {
    const response = await updateCurrency(abbreviation, rate, currencies);
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
