import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import Boss from './entity/Boss';
import Clan from './entity/Clan';
import Declaration from './entity/Declaration';
import Event from './entity/Event';
import Report from './entity/Report';
import User from './entity/User';

dotenv.config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? '',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER ?? '',
  password: process.env.DB_PASS ?? '',
  database: process.env.DB_NAME ?? '',
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true' ? true : false,
  entities: [Boss, Clan, Declaration, Event, Report, User],
  migrations: [`src/migration/*`],
});

dataSource.initialize();

export default dataSource;
