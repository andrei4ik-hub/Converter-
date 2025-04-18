import { DataSource } from "typeorm";
import { CurrencyRate } from "./entity/CurrencyRate";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "1111",
    database: "test",
    entities: [CurrencyRate],
    synchronize: true
});
