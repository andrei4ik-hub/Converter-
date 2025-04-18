
import { AppDataSource } from "../data-source";
import { CurrencyRate } from "../entity/CurrencyRate";

export async function saveCurrencyRates(apiData: any[]) {
    const currencyRepository = AppDataSource.getRepository(CurrencyRate);

    const repository = AppDataSource.getRepository(CurrencyRate);
    await repository.clear(); 

    const queryRunner = AppDataSource.createQueryRunner();
    try {
        await queryRunner.connect();

        await queryRunner.query(`TRUNCATE TABLE currency_rate RESTART IDENTITY CASCADE`);

        console.log("Auto-increment has been reset.");
    } catch (error) {
        console.error("Error resetting auto-increment:", error);
    } finally {
        await queryRunner.release();
    }
    
    console.log("Table cleared!");

    // Add BYN
    const bynCurrency = currencyRepository.create({
        Cur_ID : 900,
        // Date: new Date(),
        Cur_Abbreviation: "BYN",
        Cur_Scale: 1,
        Cur_Name: "белорусский рубль",
        Cur_OfficialRate: 1,
    });
    await currencyRepository.save(bynCurrency);
    console.log("Belarusian Ruble (BYN) added successfully!");

    
    for (const item of apiData) {
        const currencyRate = currencyRepository.create({
            Cur_ID: item.Cur_ID,
            Date: item.Date,
            Cur_Abbreviation: item.Cur_Abbreviation,
            Cur_Scale: item.Cur_Scale,
            Cur_Name: item.Cur_Name,
            Cur_OfficialRate: item.Cur_OfficialRate,
        });
        await currencyRepository.save(currencyRate);
    }
    console.log("Currency data saved successfully!");
}
