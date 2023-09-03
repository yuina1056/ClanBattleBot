import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from 'dotenv';
import clan from "./entity/Clan"
import user from "./entity/User"
import report from "./entity/Report"

dotenv.config();

const dataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    username: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
    synchronize: false,
    logging: false,
    entities: [clan, user, report],
    migrations: ["migration/*.ts"],
})

dataSource.initialize();

export default dataSource;
