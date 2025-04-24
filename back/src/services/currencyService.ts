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

  async getExchangeData(abbreviations: string[]) {
    const requiredAbbreviations = [...abbreviations, 'USD', 'BYN'];
    const currencies = await this.currencyRepository.findByAbbreviations(requiredAbbreviations);
    const usdCurrency = currencies.find(c => c.curAbbreviation === 'USD');
    const bynCurrency = currencies.find(c => c.curAbbreviation === 'BYN');
    
    if (!usdCurrency || !bynCurrency) {
        throw new Error("USD or BYN not found in the database");
    }

    const baseValue = usdCurrency.curOfficialRate / usdCurrency.curScale;
    
    const calculatedRates = this.calculateRates(currencies, baseValue);
    

    const responseAbbreviations = new Set([...abbreviations, 'BYN']);
    return calculatedRates.filter(rate => responseAbbreviations.has(rate.abbreviation));
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


    async getAllCurrencies(): Promise<Array<{curAbbreviation: string, curName: string}>> {
        const currencies = await this.currencyRepository.findAll();
        return currencies.map(currency => ({
        curAbbreviation: currency.curAbbreviation,
        curName: currency.curName
        }));
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
  
  async calculateCurrencyRate(
    baseAbbreviation: string,
    baseRate: number,
    targetAbbreviation: string
  ) {
   
    const baseCurrency = await this.currencyRepository.findByAbbreviation(baseAbbreviation);
    const targetCurrency = await this.currencyRepository.findByAbbreviation(targetAbbreviation);
  
    if (!baseCurrency || !targetCurrency) {
      throw new Error("One of currencies not found in database");
    }
  
  
    
    const rate = (
      (baseRate * baseCurrency.curOfficialRate) / 
      targetCurrency.curOfficialRate
    ).toFixed(4);
  
    return {
      abbreviation: targetCurrency.curAbbreviation,
      name: targetCurrency.curName,
      rate: rate,
      scale: targetCurrency.curScale
    };
  }
}


export const currencyRepository = new CurrencyRepository();
export const currencyService = new CurrencyService();