import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import * as sequelizeConfig from '../config/database';

const basename = path.basename(__filename);
const db: { [key: string]: any } = {};
const environment: string = process.env.NODE_ENV || 'development';

const { username, password, database, ...otherConfig } = sequelizeConfig[environment as keyof typeof sequelizeConfig];

const sequelize = new Sequelize(database, username, password, otherConfig);


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.ts');
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
// console.log({db})

export default db;