import axios from "axios";
import * as dotenv from 'dotenv';


dotenv.config();
const BASE_URL = process.env.REACT_APP_API_BASE_URL;


export async function fetchCurrencyRates() {
    try {
        const response = await axios.get(`${BASE_URL}/ExRates/Rates?Periodicity=0`);//.env
        return response.data; 
    } catch (error) {
        console.error("Error fetching currency rates:", error);
        throw error;
    }
}
