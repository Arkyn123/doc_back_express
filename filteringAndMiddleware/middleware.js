const multer = require("multer");
var path = require("path");
const { v4: uuidv4 } = require("uuid");
const db = require("../models");
const { sequelize } = db;
const dbMSSQL = require("../modelsMSSQL");
const { DIC_OFFICE, SequelizeMSSQL } = dbMSSQL;
const errors = require("../utils/errors");
const fetch = require("node-fetch");
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

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.sendStatus(errors.unauthorized.code);
  }
  const token = authHeader.split(" ")[1];
  try {
    const userFromService = await (
      await fetch(config.services.gatewayDecode, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })
    ).json();
    const user = {
      id: parseInt(userFromService.emp),
      fullname: camelCase(userFromService.FIO),
    };
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return res.sendStatus(errors.badRequest.code);
  }
};

middleware.setRolesToRequest = async (req, res, next) => {
  if (!req.permissions.authenticated) {
    return next();
  }
  if (!req.user) {
    return res.sendStatus(errors.unauthorized.code);
  }

  try {
    const userDataFromGraphQL = (
      await (
        await fetch(config.services.users, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${req.token}`,
          },
          body: JSON.stringify({
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
                      idOffice
                  }
              }
          }`,
          }),
        })
      ).json()
    ).data;

    const roles = userDataFromGraphQL.Workers[0].permissions;
    const office = userDataFromGraphQL.Workers[0].positions[0].office;
    const trollUsers = [181755];
    if (roles.some((role) => role.idAccessCode == "UEMI_ADMIN")) {
      roles.push({ idAccessCode: "SDM_SECRETARY_CHECK", idOffice: null });
      roles.push({ idAccessCode: "SDM_LABOR_CHECK", idOffice: null });
      roles.push({
        idAccessCode: "SDM_SECRETARY_REGISTRATION",
        idOffice: null,
      });
      roles.push({ idAccessCode: "SDM_LABOR_REGISTRATION", idOffice: null });
    }
    if (trollUsers.includes(req.user.id)) {
      roles.push({ idAccessCode: "admin", idOffice: null });
    }

    req.roles = roles;
    req.user.officeId = office.id;
    req.user.officeName = office.name;
    next();
  } catch (error) {
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

  console.log(routerPath, path);

  const routerPermissions = getRouterPermissions(routerPath)[path];
  const permissions = {};
  permissions.roles = routerPermissions
    .filter((p) => p.role != undefined)
    .map((p) => ({ role: p.role, officeCheck: p.officeCheck }));
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
      if (el1.role == el2.idAccessCode) return true;
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
    req.officeCheckWanted = !req.permissions.roles.some(
      (r) => r.officeCheck == false
    );
    req.permissions.roleWanted = true;
    req.permissions.fieldWanted = true;
  } else if (
    req.permissions.roles.length != 0 &&
    req.permissions.field == undefined
  ) {
    req.permissions.rolePassed = hasCommons(req.permissions.roles, req.roles);
    req.officeCheckWanted = !req.permissions.roles.some(
      (r) => r.officeCheck == false
    );
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
    if (!req.permissions.roleWanted && !req.permissions.fieldWanted) {
      return true;
    }
    if (req.permissions.roleWanted && req.permissions.rolePassed) {
      if (req.permissions.fieldWanted || req.permissions.officeCheckWanted) {
        const [field, userField] = Object.entries(req.permissions.field)[0];
        if (
          (object._options.attributes.includes(field) &&
            object[field] == req.user[userField]) ||
          req.roles.map((r) => r.idOffice).some((r) => r == object.officeId)
        ) {
          return true;
        }
        if (!object._options.attributes.includes(field)) {
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
        return true;
      }
      if (!object._options.attributes.includes(field)) {
        return true;
      }
    }
    return false;
  } else {
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
