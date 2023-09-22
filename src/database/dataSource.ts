import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import Boss from '../entity/boss';
import Clan from '../entity/clan';
import Declaration from '../entity/declaration';
import Event from '../entity/event';
import Report from '../entity/report';
import User from '../entity/user';

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
