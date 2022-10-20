const db = require("../models");
const dbMSSQL = require("../modelsMSSQL");
const { Document, DocumentRoute, DocumentType, DocumentOrderLog, Sequelize } =
  db;
const { ValidationError, Op } = Sequelize;
const errors = require("../utils/errors");
const {
  RouteCoordinationAssociation,
} = require("../filteringAndMiddleware/associations");
const {
  ownerOrHasPermissions,
} = require("../filteringAndMiddleware/middleware");
const fetch = require("node-fetch");
class DocumentController {
  async getAllDocument(req, res) {
    try {
      const filter = { ...req.filter };
      if (!filter.where) {
        filter.where = {};
      } else {
        filter.where = { ...filter.where };
      }
      filter.where["flagDeleted"] = {
        [Op.eq]: null,
      };
      if (req.query.officeName) {
        filter.where["officeName"] = {
          [Op.iLike]: `%${req.query.officeName}%`,
        };
      }
      if (req.query.fullname) {
        filter.where["usernames"] = {
          [Op.iLike]: `%${req.query.fullname}%`,
        };
      }
      if (req.query.authorFullname && /\d/.test(req.query.authorFullname)) {
        filter.where["registrationNumber"] = {
          [Op.iLike]: `%${req.query.authorFullname}%`,
        };
      }
      if (req.query.authorFullname && !/\d/.test(req.query.authorFullname)) {
        filter.where["authorFullname"] = {
          [Op.iLike]: `%${req.query.authorFullname}%`,
        };
      }
      if (req.query.myDocumentsFlag && req.query.myDocumentsFlag == "true") {
        const ids = req.roles.map((r) => r.idOffice);
        ids.push(req.user.officeId);
        filter.where["officeId"] = {
          [Op.in]: ids,
        };

        filter.where["permitionCurrent"] = {
          [Op.in]: req.roles.map((r) => r.idAccessCode),
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
      //fgthrthr
      if (!req.roles.some((r) => r.idAccessCode == "UEMI_ADMIN")) {
        const idsArray = req.roles.map((r) => r.idOffice && r.idOffice);
        idsArray.push(req.user.officeId);
        filter.where["officeId"] = {
          [Op.in]: idsArray,
        };
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

      return res.status(errors.success.code).json({ document, route });
    } catch (e) {
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async addNewDocument(req, res) {
    try {
      const route = await DocumentRoute.findOne({
        where: {
          orderId: 1,
          documentType: req.body.documentType,
        },
      });
      if (!route) {
        return res.sendStatus(errors.notFound.code);
      }
      const type = await DocumentType.findOne({
        where: {
          id: req.body.documentType,
        },
      });
      if (!type) {
        return res.sendStatus(errors.notFound.code);
      }
      const document = await Document.create({
        body: req.body.body,
        documentType: type.dataValues.id,
        documentTypeDescription: type.dataValues.description,
        authorPersonalNumber: req.user.id,
        authorFullname: req.user.fullname,
        dateApplication: req.body.dateApplication,
        statusId: 3,
        order: 1,
        permitionCurrent: route.dataValues.permition,
        permitionCurrentDesc: route.dataValues.description,
        documentTemplateID: req.body.documentTemplateID,
        users: req.body.users,
        usernames: req.body.users.map((u) => u.fullname).join(),
        officeName: req.body.officeName,
      });
      return res.status(errors.success.code).json(document.dataValues);
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
      const route = await DocumentRoute.findOne({
        where: {
          orderId: 1,
          documentType: req.body.documentType,
        },
      });
      if (!route) {
        return res.sendStatus(errors.notFound.code);
      }
      const type = await DocumentType.findOne({
        where: {
          id: req.body.documentType,
        },
      });
      if (!type) {
        return res.sendStatus(errors.notFound.code);
      }
      const document = await Document.create({
        body: req.body.body,
        documentType: type.dataValues.id,
        documentTypeDescription: type.dataValues.description,
        authorPersonalNumber: req.user.id,
        authorFullname: req.user.fullname,
        dateApplication: req.body.dateApplication,
        statusId: 1,
        order: 1,
        permitionCurrent: route.dataValues.permition,
        permitionCurrentDesc: route.dataValues.description,
        documentTemplateID: req.body.documentTemplateID,
        users: req.body.users,
        usernames: req.body.users
          ? req.body.users.map((u) => u.fullname).join(" ")
          : "",
        officeName: req.body.officeName,
        officeId: req.body.officeId,
      });
      const routeNext = await DocumentRoute.findOne({
        where: {
          orderId: 1,
          documentType: document.dataValues.documentType,
        },
      });
      await DocumentOrderLog.create({
        documentId: document.dataValues.id,
        order: document.dataValues.order,
        orderDescription: routeNext.dataValues.description,
        statusDescription: "Черновик",
        personalNumber: req.user.id,
        fullname: req.user.fullname,
      });
      return res.status(errors.success.code).json(document.dataValues);
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
      if (!route) {
        return res.sendStatus(errors.forbidden.code);
      }
      if (!ownerOrHasPermissions(req, document))
        return res.status(errors.forbidden.code).json({ message: "Нет прав" });
      if (
        req.roles
          .map((r) => r.idAccessCode)
          .includes(route.dataValues.permition)
      ) {
        if (document.dataValues.statusId == 3 && req.body.agree) {
          if (document.dataValues.order == 3) {
            await document.update({
              registrationNumber: req.body.registrationNumber,
            });
          }
          if (document.dataValues.order < 4) {
            const orderNext = document.dataValues.order + 1;
            var routeNext = await DocumentRoute.findOne({
              where: {
                orderId: orderNext,
                documentType: document.dataValues.documentType,
              },
            });
            if (!route) {
              return res.sendStatus(errors.notFound.code);
            }
            await document.update({
              order: orderNext,
              permitionCurrent: routeNext.dataValues.permition,
              permitionCurrentDesc: routeNext.dataValues.description,
            });
          } else {
            await document.increment("statusId", { by: 1 });
            var routeNext = await DocumentRoute.findOne({
              where: {
                orderId: 4,
                documentType: document.dataValues.documentType,
              },
            });
          }
        } else if (document.dataValues.statusId == 3 && !req.body.agree) {
          var routeNext = await DocumentRoute.findOne({
            where: {
              orderId: 1,
              documentType: document.dataValues.documentType,
            },
          });
          if (!route) {
            return res.sendStatus(errors.notFound.code);
          }
          await document.update({
            statusId: 2,
            order: 1,
            permitionCurrent: routeNext.dataValues.permition,
            permitionCurrentDesc: routeNext.dataValues.description,
            message: req.body.message,
            messageUserId: req.user.id,
            messageUserFullname: req.user.fullname,
          });
        }
        //для обновления статуса
        const documentNew = await Document.findByPk(req.params.documentId, {
          include: [{ all: true, nested: true, duplicating: true }],
        });
        await DocumentOrderLog.create({
          documentId: documentNew.dataValues.id,
          order: documentNew.dataValues.order,
          orderDescription: routeNext.dataValues.description,
          statusDescription:
            documentNew.dataValues.status.dataValues.description,
          personalNumber: req.user.id,
          fullname: req.user.fullname,
          message: req.body.message,
          registrationNumber: req.body.registrationNumber,
        });
        return res.status(errors.success.code).json(document);
      }
      return res.sendStatus(errors.forbidden.code);
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
      const route = await DocumentRoute.findOne({
        where: {
          orderId: 1,
          documentType: req.body.documentType,
        },
      });
      if (!route) {
        return res.sendStatus(errors.notFound.code);
      }
      if (!ownerOrHasPermissions(req, document))
        return res.sendStatus(errors.forbidden.code);
      if (
        req.user.id == document.dataValues.authorPersonalNumber &&
        !req.body.flagUpdateDraft
      ) {
        await document.update({
          body: req.body.updatedDocument,
          statusId: 3,
          order: 1,
          permitionCurrent: route.dataValues.permition,
          permitionCurrentDesc: route.dataValues.description,
          dateApplication: req.body.dateApplication,
          documentTemplateID: req.body.documentTemplateID,
          users: req.body.users,
          officeName: req.body.officeName,
          officeId: req.body.officeId,
          documentType: req.body.documentType,
        });
        const documentUpdated = await Document.findByPk(req.params.documentId, {
          include: [{ all: true, nested: true, duplicating: true }],
        });
        const routeNext = await DocumentRoute.findOne({
          where: {
            orderId: 1,
            documentType: document.dataValues.documentType,
          },
        });
        await DocumentOrderLog.create({
          documentId: documentUpdated.dataValues.id,
          order: documentUpdated.dataValues.order,
          orderDescription: routeNext.dataValues.description,
          statusDescription:
            documentUpdated.dataValues.status.dataValues.description,
          personalNumber: req.user.id,
          fullname: req.user.fullname,
        });
      }
      if (
        // req.user.id == document.dataValues.authorPersonalNumber &&
        req.body.flagUpdateDraft
      ) {
        await document.update({
          body: req.body.updatedDocument,
          permitionCurrent: route.dataValues.permition,
          permitionCurrentDesc: route.dataValues.description,
          dateApplication: req.body.dateApplication,
          documentTemplateID: req.body.documentTemplateID,
          users: req.body.users,
          officeName: req.body.officeName,
          officeId: req.body.officeId,
          documentType: req.body.documentType,
        });
      }

      // ПОИСК ЛЮДЕЙ ПО ПРАВУ
      //   const userDataFromGraphQL = (
      //     await (
      //       await fetch(config.services.users, {
      //         method: "POST",
      //         headers: {
      //           "Content-Type": "application/json",
      //           Authorization: `Bearer ${req.token}`,
      //         },
      //         body: JSON.stringify({
      //           query: `query {
      //             Workers(idAccessCode: "${document.dataValues.permitionCurrent}") {
      //               employeeNumber permissions {idOffice idAccessCode}
      //             }
      //           }`,
      //         }),
      //       })
      //     ).json()
      //   ).data;
      //  console.log(document.statusId)

      //   await fetch(config.services.mailer, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${req.token}`,
      //   },
      //   body: JSON.stringify({
      //       "employeeNumber": 184184,
      //       "subject": "SDM",
      //       "body": `Проект № <strong>12321354354 УПРАЛВЕНИЕ</strong>(какой то комментарий который кто то написал) </strong> согласован <p><a href='http://localhost:8080/documents/#form/3' rel='noopener noreferrer' target='_blank'>SDM создание документа</a></p>`,
      //       "isHTML": true,
      //      "sendAt": "2022-08-09T09:25:17.321Z"
      //   })
      // });
      // var result = [];
      // for (let i = 0; i < userDataFromGraphQL.Workers.length; i++) {
      //   for (
      //     let j = 0;
      //     j < userDataFromGraphQL.Workers[i].permissions.length;
      //     j++
      //   ) {
      //     if (
      //       userDataFromGraphQL.Workers[i].permissions[j].idOffice ==
      //         document.officeId &&
      //       userDataFromGraphQL.Workers[i].permissions[j].idAccessCode ==
      //         document.dataValues.permitionCurrent
      //     )
      //       result.push(userDataFromGraphQL.Workers[i].employeeNumber);
      //   }
      // }
      // console.log(result);

      return res.status(errors.success.code).json(document);
    } catch (e) {
      console.log(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async updateDocumentInfoForRole(req, res, next) {
    try {
      const document = await Document.findByPk(req.params.documentId, {
        include: [{ all: true, nested: true, duplicating: true }],
      });
      if (!document) {
        return res.sendStatus(errors.notFound.code);
      }
      if (!ownerOrHasPermissions(req, document))
        return res.sendStatus(errors.forbidden.code);
      await document.update({
        body: req.body.updatedDocument,
        users: req.body.users,
        officeName: req.body.officeName,
        officeId: req.body.officeId,
      });
      return next();
    } catch (e) {
      console.log(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async updateDocumentFlagDeleted(req, res) {
    try {
      const document = await Document.findByPk(req.params.documentId, {
        include: [{ all: true, nested: true, duplicating: true }],
      });
      if (!document) {
        return res.sendStatus(errors.notFound.code);
      }
      if (!ownerOrHasPermissions(req, document))
        return res.sendStatus(errors.forbidden.code);
      await document.update({
        dateApplication: req.body.dateApplication,
        deletedDate: Date.now(),
        flagDeleted: true,
        deletedAuthorFullname: req.body.deletedAuthorFullname,
        deletedAuthorPersonalNumber: req.body.deletedAuthorPersonalNumber,
      });
      return res.status(errors.success.code).json(document);
    } catch (e) {
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
      return res.sendStatus(errors.internalServerError.code);
    }
  }
}

module.exports = new DocumentController();
