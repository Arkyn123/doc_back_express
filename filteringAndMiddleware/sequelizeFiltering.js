const searchBuilder = require("sequelize-search-builder");
const db = require("../models");

module.exports = (req, res, next) => {
  try {
    if (
      Object.keys(req.body).length == 0 &&
      Object.keys(req.query).length == 0
    ) {
      req.filter = {};
    } else {
      const method = Object.keys(req.body).length != 0 ? "body" : "query";
      const request = {
        filter:
          typeof req[method].filter == "string"
            ? JSON.parse(req[method].filter)
            : req[method].filter,
        order:
          typeof req[method].order == "string"
            ? JSON.parse(req[method].order)
            : req[method].order,
        limit:
          typeof req[method].limit == "string"
            ? JSON.parse(req[method].limit)
            : req[method].limit,
        offset:
          typeof req[method].offset == "string"
            ? JSON.parse(req[method].offset)
            : req[method].offset,
      };
      const search = new searchBuilder(db.Sequelize, request)
        .setConfig({ "default-limit": false })
        .getFullQuery();
      const filter = Object.fromEntries(
        Object.entries(search).filter(([_, v]) => v != null && v != undefined)
      );
      req.filter = filter;
    }
  } catch (e) {
    req.filter = {};
  }
  next();
};
