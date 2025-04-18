import axios from 'axios';
import { useState } from 'react';

const CurrencyConverter = () => {
    const [currencyData, setCurrencyData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchConvertedData = async () => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:3000/api/get-start-data', {
                abbreviations: ["BYN", "USD", "EUR", "RUB", "PLN", "CNY"], 
            });
            setCurrencyData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching currency data:', error);
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={fetchConvertedData}>Get Currency Rates</button>
            {loading && <p>Loading...</p>}
            <ul>
                {currencyData.map((currency) => (
                    <li key={currency.abbreviation}>
                        {currency.name} ({currency.abbreviation}): {currency.officialRate}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CurrencyConverter;
