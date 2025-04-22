import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrenciesThunk, updateCurrencyThunk } from "../../slices/converterSlice";
import './currencyConverter.css';


const CurrencyConverter = () => {
    const { currencies, loading, error } = useSelector((state) => state.converter);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCurrenciesThunk()); 
    }, [ dispatch]);
    
    const handleInputChange = (abbreviation, value) => {
        const newRate = parseFloat(value);
        if (!isNaN(newRate) && newRate > 0) {
            dispatch(updateCurrencyThunk({ abbreviation, rate: newRate }));
        }
    };
    
    console.log(currencies)
    if (loading) return <p>Loading currencies...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        
        <div className="converter_container">
        <h1 className="title">Currency Converter</h1>
        {currencies.map((currency) => (
            <div key={currency.abbreviation} className="container_item">
                <div className="input_line">
                    <strong className="abbreviation">{currency.abbreviation}</strong>
                    <input
                        className="input"
                        type="tel"
                        value={currency.rate}
                        onChange={(e) => handleInputChange(currency.abbreviation, e.target.value)}
                    />
                </div>
                <p className="desc">{currency.name}</p>
            </div>
        ))}
        </div>
    );
};

export default CurrencyConverter;
