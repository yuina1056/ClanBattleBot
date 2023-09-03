import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
    type: "mysql",
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    username: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
    synchronize: false,
    logging: false,
    entities: ["src/entity/*.ts"],
    migrations: ["migration/*.ts"],
})