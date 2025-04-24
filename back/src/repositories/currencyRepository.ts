import { AppDataSource } from "../data-source";
import { CurrencyRate } from "../entity/CurrencyRate";
import { Repository, QueryRunner, In, DeepPartial } from "typeorm";

export class CurrencyRepository {
  private repository: Repository<CurrencyRate>;
  private queryRunner: QueryRunner;

  constructor() {
    this.repository = AppDataSource.getRepository(CurrencyRate);
    this.queryRunner = AppDataSource.createQueryRunner();
  }

  create(entityData: DeepPartial<CurrencyRate>): CurrencyRate {
    return this.repository.create(entityData);
  }

  
  async saveRates(rates: CurrencyRate[]): Promise<void> {
    await this.repository.save(rates);
  }
  

  
  async clearAndReset(): Promise<void> {
    try {
      await this.repository.clear();
      await this.queryRunner.connect();
      await this.queryRunner.query(`TRUNCATE TABLE currency_rate RESTART IDENTITY CASCADE`);
    } finally {
      await this.queryRunner.release();
    }
  }

  async findByAbbreviation(abbreviation: string): Promise<CurrencyRate | null> {
    return this.repository.findOne({ 
      where: { curAbbreviation: abbreviation } 
    });
  }

  async findByAbbreviations(abbreviations: string[]): Promise<CurrencyRate[]> {
    return this.repository.find({
      where: { curAbbreviation: In(abbreviations) }
    });
  }



  async findAll(): Promise<CurrencyRate[]> {
    return this.repository.find();
  }
  async createBynCurrency(): Promise<CurrencyRate> {
    const bynCurrency = this.create({
      curId: 900,
      date: new Date().toISOString().split('T')[0].split('-').reverse().join('.'),
      curAbbreviation: "BYN",
      curScale: 1,
      curName: "Белорусский рубль",
      curOfficialRate: 1,
    });
    return this.repository.save(bynCurrency);
  }
  
}