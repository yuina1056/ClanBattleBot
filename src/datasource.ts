import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    username: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
    synchronize: false,
    logging: process.env.DB_LOGGING === 'true' ? true : false,
    entities: ["src/entity/*.ts"],
    migrations: ["src/migration/*.ts"],
})

dataSource.initialize();

export default dataSource;
