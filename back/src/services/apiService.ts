import axios from "axios";

export async function fetchCurrencyRates() {
    try {
        const response = await axios.get("https://api.nbrb.by/ExRates/Rates?Periodicity=0");//.env
        return response.data; 
    } catch (error) {
        console.error("Error fetching currency rates:", error);
        throw error;
    }
}
