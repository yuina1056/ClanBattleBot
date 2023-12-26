import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

import Boss from "@/entity/Boss";
import Clan from "@/entity/Clan";
import Declaration from "@/entity/Declaration";
import Lap from "@/entity/Lap";
import Report from "@/entity/Report";
import User from "@/entity/User";
import Event from "@/entity/Event";
import EventBoss from "@/entity/EventBoss";

dotenv.config();

const dataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST ?? "",
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER ?? "",
  password: process.env.DB_PASS ?? "",
  database: process.env.DB_NAME ?? "",
  synchronize: false,
  logging: process.env.DB_LOGGING === "true" ? true : false,
  entities: [Boss, Clan, Declaration, Event, Lap, Report, User, EventBoss],
  migrations: [`src/migration/*.${process.env.ENV === "local" ? "ts" : "js"}`],
});

dataSource.initialize();

export default dataSource;
