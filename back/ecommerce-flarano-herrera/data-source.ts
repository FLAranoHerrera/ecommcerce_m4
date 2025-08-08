import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  // Lógica de conexión robusta:
  // Si DATABASE_URL existe (en Render), la usa.
  // Si no, construye la conexión con las otras variables (para local).
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  
  // Apunta a todas las entidades del proyecto
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  
  // Sincroniza en desarrollo, pero es más seguro desactivarlo para producción
  synchronize: process.env.NODE_ENV !== 'production',

  // Habilita SSL solo si DATABASE_URL está presente (es decir, en producción)
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;