import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCurrencies, updateCurrency} from "../api/apiClient";
import apiClient from "../api/apiClient";


export const initialCurrencies = ["BYN", "USD", "EUR", "RUB", "PLN","CNY","TRY"];

export const fetchCurrenciesThunk = createAsyncThunk("converter/fetchCurrencies", async () => {
    const response = await fetchCurrencies(initialCurrencies);
    return response;
});

export const updateCurrencyThunk = createAsyncThunk("converter/updateCurrency", async ({ abbreviation, rate, currencies }) => {
    const response = await updateCurrency(abbreviation, rate, currencies);
    return response;
});

export const addCurrencyThunk = createAsyncThunk(
    "converter/addCurrency",
    async ({ baseAbbreviation, baseRate, newCurrencyAbbreviation }) => {
      const response = await apiClient.post("/add-currency", {
        baseAbbreviation,
        baseRate,
        newCurrencyAbbreviation
      });
      return response.data;
    }
  );

    const converterSlice = createSlice({
        name: "converter",
        initialState: {
            currencies: [], 
            initialCurrencies,
            loading: false,
            error: null,
        },
        reducers: {
            setCurrencies: (state, action) => {
                state.currencies = action.payload;
            },
            addCurrency: (state, action) => {
                state.currencies.push(action.payload);
              },
            removeCurrency: (state, action) => {
                state.currencies = state.currencies.filter(
                  c => c.abbreviation !== action.payload
                );
            }
        },
        extraReducers: (builder) => {
            builder
                .addCase(addCurrencyThunk.fulfilled, (state, action) => {
                    state.currencies = [...action.payload]; 
                })
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

    
    
    export const selectInitialCurrencies = (state) => state.converter.initialCurrencies;
    
    export const { addCurrency, removeCurrency } = converterSlice.actions;
    export default converterSlice.reducer;

