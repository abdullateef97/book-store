import { Dialect } from 'sequelize';

export default  {
  host: process.env.DATABASE_HOST || '127.0.0.1',
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'root',
  database: process.env.DATABASE_NAME || 'core',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  logQueryParameters: true,
  dialect: <Dialect>'postgres',
};