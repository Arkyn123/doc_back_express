const db = require("../models");
const dbMSSQL = require("../modelsMSSQL");
const { DocumentRoute, Sequelize } = db;
const { ValidationError } = Sequelize;
const errors = require("../utils/errors");
const {
  RouteCoordinationAssociation,
} = require("../filteringAndMiddleware/associations");

class DocumentRouteController {
  async getAllDocumentRoute(req, res) {
    try {
      const documentRoutes = await DocumentRoute.findAll({
        include: [{ all: true, nested: true, duplicating: true }],
      });
      return res.status(errors.success.code).json(documentRoutes);
    } catch (e) {
        console.log(e)
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async addNewDocumentRoute(req, res) {
    console.log(req.body)
    try {
      const result = await DocumentRoute.create({ ...req.body });
      return res.status(errors.success.code).json(result.dataValues);
    } catch (e) {
      console.log(e);
      if (e instanceof ValidationError) {
        return res.sendStatus(errors.badRequest.code);
      }
      return res.sendStatus(errors.internalServerError.code);
    }
  }
}

module.exports = new DocumentRouteController();
