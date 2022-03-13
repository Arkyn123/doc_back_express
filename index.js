// Режим сервера production / development
const env = process.env.NODE_ENV || "development";
// Конфигурационный файл с настройками сервера
const config = require(__dirname + "/config/config.json")[env];

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");

global.config = config;
global.serverPath = __dirname;

global.connected = false;

// Промежуточная функция проверки подключения к базе данных
const { checkConnectionWithDB } = require("./middleware/middleware");

app.use(express.json({ limit: config.server.requestMaxSize }));
app.use(
  express.urlencoded({ extended: true, limit: config.server.requestMaxSize })
);
app.use(cors());
app.use(checkConnectionWithDB);

// Подключение роутеров
const documentRouter = require("./routes/document.router");
app.use(`${config.server.urlPrefix}/document`, documentRouter);
const documentStatusRouter = require("./routes/documentStatus.router");
app.use(`${config.server.urlPrefix}/documentStatus`, documentStatusRouter);

const dicOfficeRouter = require("./routes/dicOffice.router");
app.use(`${config.server.urlPrefix}/dicOffice`, dicOfficeRouter);
const dicOfficeRouterCorrespondence = require("./routes/dicOfficeCorrespondence.router");
app.use(`${config.server.urlPrefix}/dicOfficeCorrespondence`, dicOfficeRouterCorrespondence);
const documentTypeRouter = require("./routes/documentType.router");
app.use(`${config.server.urlPrefix}/documentType`, documentTypeRouter);
const documentRouteRouter = require("./routes/documentRoute.router");
app.use(`${config.server.urlPrefix}/documentRoute`, documentRouteRouter);
// Запуск сервера
const startServer = async () => {
  const db = require("./models");
  const dbMSSQL = require("./modelsMSSQL");
  const fs = require("fs");
  const path = require("path");
  try {
    // Синхронизация моделей с базой данных, флаг resetDatabaseOnRestart отвечает за принудительную очистку базы данных при перезапуске сервера
    await db.sequelize.sync({ force: config.server.resetDatabaseOnRestart });
    await dbMSSQL.sequelizeMSSQL.sync({ force: false });
    server.listen(config.server.port, config.server.host, async () => {
      console.log(`Mode: ${env}`);
      console.log(
        `Server run on\t${config.server.protocol}://${config.server.host}:${config.server.port}`
      );
      console.log(
        `DB connected\t${config.database.dialect}://${config.database.host}:${config.database.port}`
      );
      if (config.server.resetDatabaseOnRestart) {
        console.log("Database and uploads dropped, Defaults loaded");
      }
      connected = true;
    });
  } catch (error) {
    // Перезапуск в случае неудачного подключения к базе данных
    console.log(
      "Server cannot connect to database, restart after ",
      config.server.errorRestartIntervalInMinutes,
      " minutes"
    );
    setTimeout(
      startServer,
      config.server.errorRestartIntervalInMinutes * 60 * 1000
    );
  }
};

startServer();
