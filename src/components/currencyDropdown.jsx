import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyDropdown = () => {
    const [currencyList, setCurrencyList] = useState([]); // Состояние для списка валют
    const [loading, setLoading] = useState(false); // Состояние для индикации загрузки
    const [selectedCurrency, setSelectedCurrency] = useState(""); // Состояние для выбранной валюты

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:3000/api/currencies'); // GET-запрос к API
                setCurrencyList(response.data); // Установка списка валют в состояние
                setLoading(false);
            } catch (error) {
                console.error('Error fetching currencies:', error);
                setLoading(false);
            }
        };

        fetchCurrencies(); // Выполняем запрос при загрузке компонента
    }, []);

    const handleChange = (event) => {
        setSelectedCurrency(event.target.value); // Обработка выбора валюты
    };

    return (
        <div>
            {loading ? (
                <p>Loading...</p> // Индикация загрузки
            ) : (
                <div>
                    <label htmlFor="currency-dropdown">Select Currency: </label>
                    <select
                        id="currency-dropdown"
                        value={selectedCurrency}
                        onChange={handleChange}
                    >
                        <option value="" disabled>Select...</option>
                        {currencyList.map((currency, index) => (
                            <option key={index} value={currency}>
                                {currency}
                            </option>
                        ))}
                    </select>
                    {selectedCurrency && <p>You selected: {selectedCurrency}</p>} {/* Отображение выбранной валюты */}
                </div>
            )}
        </div>
    );
};

export default CurrencyDropdown;
