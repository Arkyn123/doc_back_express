const db = require("../models");
const { Document, Sequelize } = db;
const { ValidationError } = Sequelize;
const errors = require("../utils/errors");

class DocumentController {
  async getAllDocument(req, res) {
    try {
      const documents = await Document.findAll();
      return res
        .status(errors.success.code)
        .json(documents);
    } catch (e) {
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async addNewDocument(req, res) {
    try {
      const result = await Document.create({...req.body});
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
