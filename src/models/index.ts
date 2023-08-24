import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import sequelizeConfig from '../config/database';
import logger from '../config/logger';

const basename = path.basename(__filename);
const db: { [key: string]: any } = {};
const environment = process.env.NODE_ENV || 'development';

const { username, password, database, ...otherConfig } = sequelizeConfig;

const sequelize = new Sequelize(database, username, password, otherConfig);

if (environment !== 'test') {
  sequelize.authenticate().then(() => {
    logger.info('Database connection successful');
  }).catch((error) => {
    logger.info('error connecting to DB');
    logger.error(error);
  });
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;