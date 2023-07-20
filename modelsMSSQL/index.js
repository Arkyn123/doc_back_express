"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const dbMSSQL = {};

let sequelize;
if (config.databaseMSSQL.use_env_variable) {
  sequelize = new Sequelize(
    process.env[config.databaseMSSQL.use_env_variable],
    config.databaseMSSQL
  );
} else {
  sequelize = new Sequelize(
    config.databaseMSSQL.database,
    config.databaseMSSQL.username,
    config.databaseMSSQL.password,
    config.databaseMSSQL
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    dbMSSQL[model.name] = model;
  });

Object.keys(dbMSSQL).forEach((modelName) => {
  if (dbMSSQL[modelName].associate) {
    dbMSSQL[modelName].associate(dbMSSQL);
  }
});

Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
  return this._applyTimezone(date, options).format("YYYY-MM-DD HH:mm:ss.SSS");
};

dbMSSQL.sequelizeMSSQL = sequelize;
dbMSSQL.SequelizeMSSQL = Sequelize;

module.exports = dbMSSQL;
