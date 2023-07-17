const db = require("../models");
const { DocumentType, DocumentTypeKolba, Sequelize } = db;
const { ValidationError } = Sequelize;
const errors = require("../utils/errors");
const {
  RouteCoordinationAssociation,
} = require("../filteringAndMiddleware/associations");

class DocumentTypeController {
  async getAllDocumentType(req, res) {
    try {
      const documentTypes = await DocumentType.findAll({
        include: [{ all: true, nested: true, duplicating: true }],
      });
      return res.status(errors.success.code).json(documentTypes);
    } catch (e) {
      return res.sendStatus(errors.internalServerError.code);
    }
  }
  async addNewDocumentType(req, res) {
    try {
      const result = await DocumentType.upsert({ ...req.body });
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

module.exports = new DocumentTypeController();
