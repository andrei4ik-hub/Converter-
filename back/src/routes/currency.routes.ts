import { Router } from "express";
import { fetchCurrencyRates } from "../services/apiService";
import { currencyService } from "../services/currencyService";

const router = Router();

router.get("/update-rates", async (req, res) => {
  try {
    const rates = await fetchCurrencyRates();
    await currencyService.updateCurrencyRates(rates);
    res.status(200).send("Currency rates updated successfully!");
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).send("Failed to update currency rates.");
  }
});

router.post("/get-start-data", async (req, res) => {
  try {
    const { abbreviations } = req.body;
    const responseData = await currencyService.getExchangeData(abbreviations);
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching currencies:", error);
    res.status(500).json({ error: "Failed to fetch currency data." });
  }
});

router.post("/update-currency", async (req, res) => {
  try {
    const { abbreviation, rate, currencies } = req.body;
    const updatedData = await currencyService.updateCurrencyRate(
      abbreviation,
      parseFloat(rate),
      currencies.map((c: any) => c.abbreviation)
    );
    res.status(200).json(updatedData);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error});
  }
});

export default router;