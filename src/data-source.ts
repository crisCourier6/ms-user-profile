import "reflect-metadata"
import { DataSource } from "typeorm"
import "dotenv/config"
import { UserRatesFood } from "./entity/UserRatesFood"
import { Allergen } from "./entity/Allergen"
import { UserRejectsAllergen } from "./entity/UserRejectsAllergen"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [UserRatesFood, UserRejectsAllergen, Allergen],
    migrations: [],
    subscribers: [],
})
