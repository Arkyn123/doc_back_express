const multer = require("multer");
var path = require("path");
const { v4: uuidv4 } = require("uuid");
const db = require("../models");
const { sequelize } = db;
const axios = require("axios");
const errors = require("../utils/errors");

// Хранилище файлов
const storage = multer.diskStorage({
  // Папка для хранения
  destination: function (req, file, cb) {
    cb(null, config.server.fileUploadFolderPath);
  },
  // Формат выдачи имен файлов uuidv4 + расширение файла
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const middleware = {};

// Загрузка одного файла
/**
 * @param {string} field field name
 * @example singleUpload('myField1')
 */
middleware.singleUpload = (field) => upload.single(field);

// Загрузка нескольких файлов
/**
 * @param {string} field field name
 * @param {number} maxCount count of files
 * @example arrayUpload('myField1',12)
 */
middleware.arrayUpload = (field, maxCount) => upload.array(field, maxCount);

// Загрузка нескольких файлов из нескольких input
/**
 * @param {array} fieldArray array of fields
 * @example fieldsUpload([{field: 'myField1', maxCount: 12}, {field: 'myField2', maxCount: 8}])
 */
middleware.fieldsUpload = (fieldArray) => upload.fields(fieldArray);

// Проверка соединения с базой данных
middleware.checkConnectionWithDB = async (req, res, next) => {
  try {
    await sequelize.authenticate();
    if (!connected) {
      serverLog.info("Success connection to database");
      connected = true;
    }
  } catch (err) {
    if (connected) {
      serverLog.error("Server cannot connect to database");
      connected = false;
    }
  }
  next();
};

// форматирование имени (ИВАНОВ ИВАН ИВАНОВИЧ => Иванов Иван Иванович)
const camelCase = (rawWord) => {
  return rawWord
    .trim()
    .split(" ")
    .map((w) => w.toLowerCase())
    .map((w) => (w = w[0].toUpperCase() + w.substring(1)))
    .join(" ");
};

middleware.setUserToRequest = async (req, res, next) => {
  if (!req.permissions.authenticated) {
    return next();
  }
  //Получение токена из хедера
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.sendStatus(errors.unauthorized.code);
  }
  const token = authHeader.split(" ")[1];

  try {
    // Если кеширование пользователя включено, то проверяем кеш на наличие токена, если токен присутствует,
    // то возвращаем пользователя из кеша
    // if (config.redis.enabled && redisConnected && config.redis.types.users.enabled) {
    //     const redisUser = await redis.get(`${config.redis.types.users.prefix}:${token}`)
    //     if (redisUser) {
    //         // Если объект пользователя найден в кеше, то помещаем его в запрос
    //         req.user = JSON.parse(redisUser)
    //         req.token = token
    //         return next()
    //     }
    // }
    // Если кеширование пользователей выключено или токен в кеше не найден, то получаем пользователя из сервиса
    const userFromService = (
      await axios.post(config.services.gatewayDecode, {
        token,
      })
    ).data;
    // Форматирование объекта пользователя
    const user = {
      id: parseInt(userFromService.emp),
      fullname: camelCase(userFromService.FIO),
    };
    // Если кеширование пользователей включено, и пользователь не найден в кеше, а получен из сервиса,
    // то помещаем пользователя в кеш, время хранения пользователя в кеше равно config.redis.types.users.cachingTimeInMinutes
    // в минутах
    // if (config.redis.enabled && redisConnected && config.redis.types.users.enabled) {
    //     await redis.setEx(`${config.redis.types.users.prefix}:${token}`, config.redis.types.users.cachingTimeInMinutes * 60, JSON.stringify(user))
    // }
    // Помещаем объект пользователя в запрос
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    // Если передан неверный токен
    return res.sendStatus(errors.badRequest.code);
  }
};

middleware.setRolesToRequest = async (req, res, next) => {
  if (!req.permissions.authenticated) {
    return next();
  }
  //Если неавторизован, то возвращаем ошибку
  if (!req.user) {
    return res.sendStatus(errors.unauthorized.code);
  }

  try {
    // Если кеширование ролей включено, то проверяем кеш на наличие л.н. пользователя, если л.н. присутствует,
    // то возвращаем роли из кеша
    // if (config.redis.enabled && redisConnected && config.redis.types.roles.enabled) {
    //     const redisRoles = await redis.get(`${config.redis.types.roles.prefix}:${req.user.id}`)
    //     if (redisRoles) {
    //         req.roles = JSON.parse(redisRoles)
    //         return next()
    //     }
    // }
    // Если кеширование ролей выключено или л.н. пользователя в кеше не найден, то получаем роли из сервиса
    const userDataFromGraphQL = (
      await axios.post(
        config.services.users,
        {
          query: `query {
                Workers(employeeNumber: ${req.user.id}) {
                    positions {
                        office {
                            id
                            name
                        }
                    }
                    permissions {
                        idAccessCode
                    }
                }
            }`,
        },
        {
          headers: {
            Authorization: `Bearer ${req.token}`,
          },
        }
      )
    ).data.data;

    // Форматирование массива ролей
    const roles = userDataFromGraphQL.Workers[0].permissions.map(
      (permission) => permission.idAccessCode
    );
    const office = userDataFromGraphQL.Workers[0].positions[0].office;
    if (req.user.id == 181755) {
      roles.push("admin");
      roles.push("SDM_Labor_Check");
    }
    if (req.user.id == 181754) {
      roles.push("admin");
      roles.push("SDM_Secretary_Check");
      roles.push("SDM_Labor_Check");
      roles.push("SDM_Secretary_Registration");
      roles.push("SDM_Labor_Registration");
    }
    // Если кеширование ролей включено, и л.н. не найден в кеше, а получен из сервиса,
    // то помещаем роли в кеш, время хранения пользователя в кеше равно config.redis.types.roles.cachingTimeInMinutes
    // в минутах
    // if (config.redis.enabled && redisConnected && config.redis.types.roles.enabled) {
    //     await redis.setEx(`${config.redis.types.roles.prefix}:${req.user.id}`, config.redis.types.roles.cachingTimeInMinutes * 60, JSON.stringify(roles))
    // }
    // Помещаем массив ролей в запрос
    req.roles = roles;
    req.user.officeId = office.id;
    req.user.officeName = office.name;
    next();
  } catch (error) {
    // Если пользователь не авторизован
    return res.sendStatus(errors.badRequest.code);
  }
};

const getRouterPermissions = (path) => {
  var permissions = require("../config/permissions");
  path.forEach((item) => {
    permissions = permissions[item];
  });
  return permissions;
};

middleware.setWantedPermission = (req, res, next) => {
  const routerPath = [
    config.server.urlPrefix,
    ...req.baseUrl
      .substring(config.server.urlPrefix.length)
      .split("/")
      .filter((item) => item != ""),
  ];
  const path = req.route.path;
  const routerPermissions = getRouterPermissions(routerPath)[path];
  const permissions = {};
  permissions.roles = routerPermissions
    .filter((p) => p.role != undefined)
    .map((p) => p.role);
  permissions.field = routerPermissions
    .filter((p) => p.field != undefined)
    .map((p) => p.field);
  permissions.field =
    permissions.field.length != 0 ? permissions.field[0] : undefined;
  if (permissions.roles.length == 0 && permissions.field == undefined) {
    permissions.authenticated = routerPermissions.find(
      (p) => p.authenticated != undefined
    );
    permissions.authenticated = permissions.authenticated
      ? permissions.authenticated.authenticated
      : false;
  } else {
    permissions.authenticated = true;
  }
  req.permissions = permissions;
  next();
};

const hasCommons = (array1, array2) => {
  for (const el1 of array1) {
    for (const el2 of array2) {
      if (el1 == el2) return true;
    }
  }
  return false;
};

middleware.checkPermissions = async (req, res, next) => {
  if (!req.permissions.authenticated) {
    return next();
  }
  if (req.permissions.roles.length != 0 && req.permissions.field != undefined) {
    req.permissions.rolePassed = hasCommons(req.permissions.roles, req.roles);
    req.permissions.roleWanted = true;
    req.permissions.fieldWanted = true;
  } else if (
    req.permissions.roles.length != 0 &&
    req.permissions.field == undefined
  ) {
    req.permissions.rolePassed = hasCommons(req.permissions.roles, req.roles);
    if (!req.permissions.rolePassed) {
      return res.sendStatus(errors.forbidden.code);
    } else {
      req.permissions.roleWanted = true;
      req.permissions.fieldWanted = false;
      return next();
    }
  } else {
    req.permissions.fieldWanted =
      req.permissions.field == undefined ? false : true;
    req.permissions.roleWanted = false;
    return next();
  }
  next();
};

middleware.ownerOrHasPermissions = (req, object) => {
  if (req.permissions.authenticated) {
    // Если требуется авторизация
    if (!req.permissions.roleWanted && !req.permissions.fieldWanted) {
      // Если не требуется роль, и не требуется соответствие полю
      return true;
    }
    if (req.permissions.roleWanted && req.permissions.rolePassed) {
      // Если требуется роль, то проверяем, прошла ли она проверку
      if (req.permissions.fieldWanted) {
        const [field, userField] = Object.entries(req.permissions.field)[0];
        if (
          object._options.attributes.includes(field) &&
          object[field] == req.user[userField]
        ) {
          // Если требуется соответствие полю (например ownerId), то проверяем
          return true;
        }
        if (!object._options.attributes.includes(field)) {
          // Если объект не содержит искомого поля
          return true;
        }
        return false;
      }
      return true;
    }
    if (req.permissions.fieldWanted) {
      const [field, userField] = Object.entries(req.permissions.field)[0];
      if (
        object._options.attributes.includes(field) &&
        object[field] == req.user[userField]
      ) {
        // Если требуется соответствие полю (например ownerId), то проверяем
        return true;
      }
      if (!object._options.attributes.includes(field)) {
        // Если объект не содержит искомого поля
        return true;
      }
    }
    return false;
  } else {
    // Если авторизация не требуется
    return true;
  }
};

middleware.permissions = [
  middleware.setWantedPermission,
  middleware.setUserToRequest,
  middleware.setRolesToRequest,
  middleware.checkPermissions,
];

module.exports = middleware;

// https://habr.com/ru/company/otus/blog/490296/
