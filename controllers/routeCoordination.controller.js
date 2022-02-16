const db = require("../models");
const { RouteCoordination, Sequelize } = db;
const { ValidationError } = Sequelize;
const errors = require("../utils/errors");

class RouteCoordinationController {
  async getAllRoutes(req, res) {
    try {
      const routes = await RouteCoordination.findAll();
      return res
        .status(errors.success.code)
        .json(routes);
    } catch (e) {
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async addNewRoute(req, res) {
    try {
      const result = await RouteCoordination.create({...req.body});
      return res.status(errors.success.code).json(result.dataValues);
    } catch (e) {
      console.log(e)
      if (e instanceof ValidationError) {
        return res.sendStatus(errors.badRequest.code);
      }
      return res.sendStatus(errors.internalServerError.code);
    }
  }
}


module.exports = new RouteCoordinationController();
