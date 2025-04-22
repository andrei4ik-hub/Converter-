import axios from "axios";
import { MongoMissingCredentialsError } from "typeorm/browser";

const apiClient = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export const fetchCurrencies = async (abbreviations) => {
    try {
        
        const response = await apiClient.post("/get-start-data", { abbreviations });
        console.log(response.data)
        return response.data;

    } catch (error) {
        console.error("Error fetching currencies:", error);
        throw error; 
    }
};

export const updateCurrency = async (abbreviation, rate, currencies) => {
    try {
        const response = await apiClient.post("/update-currency", { abbreviation, rate , currencies});
        return response.data;
    } catch (error) {
        console.error("Error updating currency:", error);
        throw error;
    }
};

export default apiClient;