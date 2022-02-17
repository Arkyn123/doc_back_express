const db = require("../models");
const { Document, RouteCoordination, Sequelize } = db;
const { ValidationError } = Sequelize;
const errors = require("../utils/errors");
const {
  RouteCoordinationAssociation,
} = require("../filteringAndMiddleware/associations");

class DocumentController {
  async getAllDocument(req, res) {
    try {
      const documents = await Document.findAll({
        include: RouteCoordinationAssociation,
      });
      return res
        .status(errors.success.code)
        .json(documents);
    } catch (e) {
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async addNewDocument(req, res) {
    try {
      const result = await Document.create({...req.body.body.body});
      const rcs = req.body.body.routeCoordinations.map(rc => ({
        ...rc,
        documentId: result.dataValues.id,
        statusId: 1
      }))
      const rcRes = await RouteCoordination.bulkCreate(rcs);
      console.warn(rcRes)
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


module.exports = new DocumentController();
