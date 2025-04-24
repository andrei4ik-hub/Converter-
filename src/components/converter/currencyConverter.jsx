import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrenciesThunk, updateCurrencyThunk,removeCurrency, selectInitialCurrencies} from "../../slices/converterSlice";
import apiClient from "../../api/apiClient"; 
import { addCurrency } from "../../slices/converterSlice"; 
import Span from "../button/span"
import './currencyConverter.css';

const CurrencyConverter = () => {
  const { currencies, loading, error } = useSelector((state) => state.converter);
  const initialCurrencies = useSelector(selectInitialCurrencies);
  const dispatch = useDispatch();
  const [localRates, setLocalRates] = useState({});

  useEffect(() => {
    dispatch(fetchCurrenciesThunk());
  }, [dispatch]);

  useEffect(() => {
    const newRates = currencies.reduce((acc, currency) => {
      acc[currency.abbreviation] = currency.rate;
      return acc;
    }, {});
    setLocalRates((prev) => ({ ...prev, ...newRates }));
  }, [currencies]);

  const handleInputChange = (abbreviation, value) => {
    const newRate = parseFloat(value);
    if (!isNaN(newRate)) {
      setLocalRates((prev) => ({ ...prev, [abbreviation]: newRate }));
      dispatch(updateCurrencyThunk({ abbreviation, rate: newRate, currencies:currencies }));
    }
  };



const existingCurrencies = currencies.map(item => item.abbreviation); 




  const handleAddCurrency = async (newAbbreviation) => {
    try {
      const baseCurrency = currencies.find(c => c.abbreviation === 'BYN');
      
      const response = await apiClient.post("/calculate-currency", {
        baseAbbreviation: "BYN",
        baseRate: baseCurrency?.rate || 1,
        targetAbbreviation: newAbbreviation
      });

      dispatch(addCurrency(response.data));
    } catch (error) {
      console.error('Failed to add currency:', error);
    }
  };

    const handleRemoveCurrency = (abbreviation) => {
        dispatch(removeCurrency(abbreviation));
    };

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
              value={localRates[currency.abbreviation] || ""}
              onChange={(e) => handleInputChange(currency.abbreviation, e.target.value)}
            />
             {!initialCurrencies.includes(currency.abbreviation)  && (
                            <button 
                                className="remove-btn"
                                onClick={() => handleRemoveCurrency(currency.abbreviation)}
                            >
                                ×
                            </button>
                        )}
          </div>
          <p className="desc">{currency.name}</p>
        </div>
      ))}
      <Span 
        existingCurrencies={existingCurrencies}
        onCurrencySelect={handleAddCurrency} 
        />
    </div>
  );
};

export default CurrencyConverter;