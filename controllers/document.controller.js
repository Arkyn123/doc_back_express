const db = require("../models");
const dbMSSQL = require("../modelsMSSQL");
const { Document, DocumentRoute, RouteCoordination, Sequelize } = db;
const { ValidationError, Op } = Sequelize;
const errors = require("../utils/errors");
const {
  RouteCoordinationAssociation,
} = require("../filteringAndMiddleware/associations");
const {
  ownerOrHasPermissions,
} = require("../filteringAndMiddleware/middleware");

class DocumentController {
  async getAllDocument(req, res) {
    try {
      const filter = { ...req.filter };
      if (!filter.where) {
        filter.where = {};
      } else {
        filter.where = { ...filter.where };
      }
      if (req.query.officeName) {
        filter.where["body.officeName"] = {
          [Op.iLike]: `%${req.query.officeName}%`,
        };
      }
      if (req.query.fullname) {
        filter.where["body.fullname"] = {
          [Op.iLike]: `%${req.query.fullname}%`,
        };
      }
      if (req.query.modelDate) {
        if (req.query.modelDate.length == 10) {
          filter.where["dateApplication"] = {
            [Op.eq]: new Date(req.query.modelDate),
          };
        } else {
          const modelDate = JSON.parse(req.query.modelDate);
          filter.where["dateApplication"] = {
            [Op.gte]: new Date(modelDate.from),
            [Op.lte]: new Date(modelDate.to),
          };
        }
      }

      // const new_filter = {
      //   [Op.or]: filter,
      // }
      // console.warn(new_filter);
      const documents = await Document.findAll({
        ...filter,
        include: [{ all: true, nested: true, duplicating: true }],
      });
      // console.table(documents.map((doc) => doc.dataValues));
      return res.status(errors.success.code).json(documents);
    } catch (e) {
      console.warn(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async getDocumentById(req, res) {
    try {
      const document = await Document.findByPk(req.params.documentId, {
        include: [{ all: true, nested: true, duplicating: true }],
      });
      const route = await DocumentRoute.findOne({
        where: {
          orderId: document.dataValues.order,
          documentType: document.dataValues.documentType,
        },
        include: [{ all: true, nested: true, duplicating: true }],
      });

      return res.status(errors.success.code).json({document, route});
    } catch (e) {
      console.log(e)
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async addNewDocument(req, res) {
    try {
      console.log(req.user);
      const result = await Document.create({
        body: req.body.body,
        documentType: req.body.documentType,
        authorPersonalNumber: req.user.id,
        authorFullname: req.user.fullname,
        dateApplication: req.body.body.dateApplication,
        statusId: 3,
        order: 1,
        documentTemplateID: req.body.documentTemplateID,
      });
      return res.status(errors.success.code).json(result.dataValues);
    } catch (e) {
      console.log(e);
      if (e instanceof ValidationError) {
        return res.sendStatus(errors.badRequest.code);
      }
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async addNewDocumentInDraft(req, res) {
    try {
      const result = await Document.create({
        body: req.body.body,
        documentType: req.body.documentType,
        authorPersonalNumber: req.user.id,
        authorFullname: req.user.fullname,
        dateApplication: req.body.body.dateApplication,
        statusId: 1,
        order: 1,
        documentTemplateID: req.body.documentTemplateID,
      });
      return res.status(errors.success.code).json(result.dataValues);
    } catch (e) {
      console.log(e);
      if (e instanceof ValidationError) {
        return res.sendStatus(errors.badRequest.code);
      }
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async updateDocumentByDocumentId(req, res) {
    try {
      const document = await Document.findByPk(req.params.documentId, {
        include: [{ all: true, nested: true, duplicating: true }],
      });
      if (!document) {
        return res.sendStatus(errors.notFound.code);
      }
      const route = await DocumentRoute.findOne({
        where: {
          orderId: document.dataValues.order,
          documentType: document.dataValues.documentType,
        },
        include: [{ all: true, nested: true, duplicating: true }],
      });
      console.log(route.dataValues.permition);
      // if (!ownerOrHasPermissions(req, document))
      //   return res.sendStatus(errors.forbidden.code);
      console.log(req.body.agree);
      console.log(req.roles);
      if (req.roles.includes(route.dataValues.permition)) {
        if (document.dataValues.statusId == 3 && req.body.agree) {
          if (document.dataValues.order < 4) {
            await document.increment("order", { by: 1 });
          } else {
            await document.increment("statusId", { by: 1 });
          }
          await document.update({
            body: req.body.updatedDocument,
            message: req.body.message,
            registrationNumber: req.body.registrationNumber,
            documentTemplateID: req.body.documentTemplateID,
            name: req.body.name,
            resource: req.body.resource
          });
        } else if (document.dataValues.statusId == 3 && !req.body.agree) {
          await document.update({
            statusId: 2,
            order: 1,
            body: req.body.updatedDocument,
            message: req.body.message,
            documentTemplateID: req.body.documentTemplateID,
            name: req.body.name,
            resource: req.body.resource
          });
        }
        console.log(
          `order ${document.dataValues.order}, statusId ${document.dataValues.statusId}`
        );
      }
      return res.status(errors.success.code).json(document);
    } catch (e) {
      console.log(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async updateDocumentFromDraftAndRevisionByDocumentId(req, res) {
    try {
      const document = await Document.findByPk(req.params.documentId, {
        include: [{ all: true, nested: true, duplicating: true }],
      });
      if (!document) {
        return res.sendStatus(errors.notFound.code);
      }
      if (!ownerOrHasPermissions(req, document))
        return res.sendStatus(errors.forbidden.code);
      if (req.user.id == document.dataValues.authorPersonalNumber) {
        await document.update({
          body: req.body.updatedDocument,
          statusId: 3,
          order: 1,
          documentTemplateID: req.body.documentTemplateID,
          name: req.body.name,
          resource: req.body.resource
        });
      }
      return res.status(errors.success.code).json(document);
    } catch (e) {
      console.log(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async deleteAllDocuments(req, res) {
    try {
      Document.destroy({
        where: {},
      });
      return res.status(errors.success.code).json("delete all");
    } catch (e) {
      console.log(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }
}

module.exports = new DocumentController();
