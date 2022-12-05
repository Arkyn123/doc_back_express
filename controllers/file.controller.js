const db = require("../models");
const { DocumentFile, Sequelize } = db;
const { ValidationError } = Sequelize;
const errors = require("../utils/errors");
const {
  RouteCoordinationAssociation,
} = require("../filteringAndMiddleware/associations");
class DocumentFiles {
  async addNewFile(req, res) {
    //   console.log(ownerOrHasPermissions);
    try {
      const newFile = await DocumentFile.create({
        ...req.body,
      });
      return res.status(errors.success.code).json(newFile);
    } catch (error) {
      res.sendStatus(errors.internalServerError.code);
    }
  }

  async getFileById(req, res) {
    try {
      const file = await DocumentFile.findAll({
        where: {
          documentId: req.params.id,
          statusDelete: false,
        },
      });
      return res.status(errors.success.code).json(file);
    } catch (error) {
      res.sendStatus(errors.internalServerError.code);
    }
  }
  async getFiles(req, res) {
    try {
      const files = await DocumentFile.findAll({
        include: [{ all: true, nested: true, duplicating: true }],
        where: { statusDelete: false },
      });
      return res
        .status(errors.success.code)
        .json(files.map((e) => e.documentId));
    } catch (error) {
      res.sendStatus(errors.internalServerError.code);
    }
  }
  async deleteFile(req, res) {
    try {
      const file = await DocumentFile.findOne({
        where: {
          id: req.params.id,
        },
      });
      console.log(file);
      await file.update({ statusDelete: true });
      return res.status(errors.success.code).json(file.id);
    } catch (error) {
      res.sendStatus(errors.internalServerError.code);
    }
  }
}

module.exports = new DocumentFiles();
