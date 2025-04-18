import { Router } from "express";
import { fetchCurrencyRates } from "../services/apiService";
import { saveCurrencyRates } from "../services/dbService";
import { AppDataSource } from "../data-source";
import { CurrencyRate } from "../entity/CurrencyRate";
import { In } from "typeorm";

const router = Router();
//мб разбить запросы по файлам и обработку вынести в сервисы
router.get("/update-rates", async (req, res) => {
    try {
        const rates = await fetchCurrencyRates();
        await saveCurrencyRates(rates);
        res.status(200).send("Currency rates updated successfully!");
    } catch (error) {
        res.status(500).send("Failed to update currency rates.");
    }           
});


router.post("/get-start-data", async (req, res) => {
    try {
        const abbreviations = ["BYN", "USD", "EUR", "RUB", "PLN", "CNY"];
        const currencyRepository = AppDataSource.getRepository(CurrencyRate);

        const currencies = await currencyRepository.find({
            where: { Cur_Abbreviation: In(abbreviations) },
        });

        const bynValue = 10; // Initial value for BYN
        const responseData = currencies.map((currency) => ({
            abbreviation: currency.Cur_Abbreviation,
            name: currency.Cur_Name,
            rate:
                currency.Cur_Abbreviation === "BYN"
                    ? bynValue
                    : ((bynValue * currency.Cur_Scale) / currency.Cur_OfficialRate).toFixed(2),
            scale: currency.Cur_Scale,
        }));

        res.status(200).json(responseData);
    } catch (error) {
        console.error("Error fetching currencies:", error);
        res.status(500).json({ error: "Failed to fetch currency data." });
    }
});

router.post("/update-currency", async (req, res) => {
    try {
        const { abbreviation, rate } = req.body;

        const currencyRepository = AppDataSource.getRepository(CurrencyRate);
        const abbreviations = ["BYN", "USD", "EUR", "RUB", "PLN", "CNY"];

        const currencies = await currencyRepository.find({
            where: { Cur_Abbreviation: In(abbreviations) },
        });

        const updatedCurrency = currencies.find((currency) => currency.Cur_Abbreviation === abbreviation);

        if (!updatedCurrency) {
            return res.status(404).json({ error: "Currency not found." });
        }

        const updatedBYNValue =
            abbreviation === "BYN"
                ? rate
                : (rate * updatedCurrency.Cur_OfficialRate) / updatedCurrency.Cur_Scale;

        const updatedRates = currencies.map((currency) => ({
            abbreviation: currency.Cur_Abbreviation,
            name: currency.Cur_Name,
            rate:
                currency.Cur_Abbreviation === "BYN"
                    ? updatedBYNValue.toFixed(2)
                    : ((updatedBYNValue * currency.Cur_Scale) / currency.Cur_OfficialRate).toFixed(2),
            scale: currency.Cur_Scale,
        }));

        res.status(200).json(updatedRates);
    } catch (error) {
        console.error("Error updating currency rates:", error);
        res.status(500).json({ error: "Failed to update currency rates." });
    }
});


export default router;

