import 'dotenv/config';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

const useUrl = Boolean(process.env.DATABASE_URL);
const ssl =
  process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : false;

const options: DataSourceOptions = useUrl
  ? {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl,
      entities: [__dirname + '/entities/*.entity.{js,ts}'],
      migrations: [__dirname + '/migrations/*.{js,ts}'],
      synchronize: false,
    }
  : {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/entities/*.entity.{js,ts}'],
      migrations: [__dirname + '/migrations/*.{js,ts}'],
      synchronize: false,
    };

export default new DataSource(options);
