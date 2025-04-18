import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrencies, updateCurrency } from "./converterSlice";
import './index.css'

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
        <div className="converter-container">
            <h1>Currency Converter</h1>
            {currencies.map((currency) => (
                <div key={currency.abbreviation} className="converter-container_item">
                    <div className="converter-container_input_line">
                    <strong className="valuta">{currency.abbreviation}</strong>
                    <input className="input"
                        type="number"
                        value={currency.rate}
                        onChange={(e) => handleInputChange(currency.abbreviation, e.target.value)}
                    />
                    </div>
                    <p className="converter-container__item-currency-name">{currency.name}</p>
                </div>
            ))}
        </div>
    );
};

export default CurrencyConverter;
