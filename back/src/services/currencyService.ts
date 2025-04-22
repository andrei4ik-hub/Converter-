import { CurrencyRepository } from "../repositories/currencyRepository";
import { CurrencyRate } from "../entity/CurrencyRate";

export class CurrencyService {
  private currencyRepository: CurrencyRepository;

  constructor() {
    this.currencyRepository = new CurrencyRepository();
  }

  async updateCurrencyRates(apiData: any[]): Promise<void> {
    try {
      await this.currencyRepository.clearAndReset();
      await this.currencyRepository.createBynCurrency();
      const rates = this.transformApiData(apiData);
      await this.currencyRepository.saveRates(rates);
    } catch (error) {
      console.error("Error updating currency rates:", error);
      throw error;
    }
  }

  async getExchangeData(abbreviations: string[], baseValue: number = 10.00) {   // инициализация бел рублей
    const currencies = await this.currencyRepository.findByAbbreviations(abbreviations);
    return this.calculateRates(currencies, baseValue);
  }

  async updateCurrencyRate(abbreviation: string, newRate: number, currencies: string[]) {
    const dbCurrencies = await this.currencyRepository.findByAbbreviations(currencies);
    const updatedCurrency = dbCurrencies.find(c => c.curAbbreviation === abbreviation);
    
    if (!updatedCurrency) {
      throw new Error("Currency not found");
    }

    const baseValue = abbreviation === "BYN" 
      ? newRate 
      : (newRate * updatedCurrency.curOfficialRate) / updatedCurrency.curScale;

    return this.calculateRates(dbCurrencies, baseValue);
  }

  private calculateRates(currencies: CurrencyRate[], baseValue: number) {
    const bynCurrency = currencies.find(c => c.curAbbreviation === "BYN")!;
    
    return currencies.map(currency => ({
      abbreviation: currency.curAbbreviation,
      name: currency.curName,
      rate: this.calculateSingleRate(currency, bynCurrency, baseValue),
      scale: currency.curScale,
    }));
  }

  private calculateSingleRate(currency: CurrencyRate, byn: CurrencyRate, baseValue: number) {
    if (currency.curAbbreviation === "BYN") return baseValue.toFixed(2);
    return ((baseValue * currency.curScale) / currency.curOfficialRate).toFixed(2);
  }

  
  private transformApiData(apiData: any[]): CurrencyRate[] {
    return apiData.map(item => 
      this.currencyRepository.create({
        curId: item.Cur_ID,
        date: item.Date,
        curAbbreviation: item.Cur_Abbreviation,
        curScale: item.Cur_Scale,
        curName: item.Cur_Name,
        curOfficialRate: item.Cur_OfficialRate,
      })
    );
  }
}


export const currencyRepository = new CurrencyRepository();
export const currencyService = new CurrencyService();