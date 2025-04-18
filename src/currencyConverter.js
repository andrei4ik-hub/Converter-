import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrencies, updateCurrency } from "./converterSlice";

const CurrencyConverter = () => {
    const { currencies, loading, error } = useSelector((state) => state.converter);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCurrencies()); 
    }, [dispatch]);

    const handleInputChange = (abbreviation, value) => {
        const newRate = parseFloat(value);
        if (!isNaN(newRate) && newRate > 0) {
            dispatch(updateCurrency({ abbreviation, rate: newRate }));
        }
    };

    if (loading) return <p>Loading currencies...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="converter">
            <h1>Currency Converter</h1>
            {currencies.map((currency) => (
                <div key={currency.abbreviation} className="converter-item">
                    <strong>{currency.abbreviation}</strong>
                    <input
                        type="number"
                        value={currency.rate}
                        onChange={(e) => handleInputChange(currency.abbreviation, e.target.value)}
                    />
                    <p>{currency.name}</p>
                </div>
            ))}
        </div>
    );
};

export default CurrencyConverter;
