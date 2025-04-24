import axios from "axios";


const apiClient = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export const fetchCurrencies = async (abbreviations) => {
    try {
        
        const response = await apiClient.post("/get-start-data", { abbreviations });
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
export const getDropdown = async () => {
    try {
        const response = await apiClient.get("/get-currencies");
        return response.data;
    } catch (error) {
        console.error("Ошибка при запросе к API:", error);
    }
};

export const addCurrency = async (baseAbbreviation, baseRate, newCurrencyAbbreviation) => {
    try {
        const response = await apiClient.post("/add-currency", { 
            baseAbbreviation, 
            baseRate,
            newCurrencyAbbreviation 
        });
        return response.data;
    } catch (error) {
        console.error("Error adding currency:", error);
        throw error;
    }
};


export default apiClient;
