const db = require("../models");
const { sequelize } = db;

const middleware = {};

// Проверка соединения с базой данных
middleware.checkConnectionWithDB = async (req, res, next) => {
  try {
    await sequelize.authenticate();
    if (!connected) {
      console.log("Success connection to database");
      connected = true;
    }
  } catch (err) {
    if (connected) {
      console.log("Server cannot connect to database");
      connected = false;
    }
  }
  next();
};

module.exports = middleware;
