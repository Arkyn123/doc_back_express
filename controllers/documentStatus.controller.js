const db = require("../models");
const { DocumentStatus, Sequelize } = db;
const { ValidationError } = Sequelize;
const errors = require("../utils/errors");

class DocumentStatusController {
  async getAllStatuses(req, res) {
    try {
      const statuses = await DocumentStatus.findAll();
      return res.status(errors.success.code).json(statuses);
    } catch (e) {
      return res.sendStatus(errors.internalServerError.code);
    }
  }
  async addNewStatus(req, res) {
    try {
      const result = await DocumentStatus.create({ ...req.body });
      return res.status(errors.success.code).json(result.dataValues);
    } catch (e) {
      if (e instanceof ValidationError) {
        return res.sendStatus(errors.badRequest.code);
      }
      return res.sendStatus(errors.internalServerError.code);
    }
  }
}

module.exports = new DocumentStatusController();
