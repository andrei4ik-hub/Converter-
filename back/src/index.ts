import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import currencyRouter from "./routes/currency.routes"


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use("/api", currencyRouter);




AppDataSource.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => console.log(error));
