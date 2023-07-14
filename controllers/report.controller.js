const db = require("../models");
const { Document, Sequelize } = db;
const { Op } = Sequelize;
const errors = require("../utils/errors");

class DocumentReport {
  async getAllDocumentsInfo(req, res) {
    try {
      const documents = await Document.findAll({
        where: [
          {
            dateApplication: {
              [Op.between]: [
                new Date(req.body.startDate),
                new Date(req.body.endDate),
              ],
            },
            flagDeleted: {
              [Op.not]: true,
            },
          },
        ],
      });

      let values = [];
      documents.map((m) =>
        values.push({
          officeName: m.officeName,
          officeId: m.officeId,
          status: m.statusId,
          date: m.dateApplication,
        })
      );
      const os = { 1: 0, 2: 0, 3: 0, 4: 0 };
      const count = values.reduce((acc, n) => {
        (acc[n.officeName] || (acc[n.officeName] = { ...os }))[n.status]++;
        return acc;
      }, {});
      return res.status(errors.success.code).json(count);
    } catch (error) {
      res.sendStatus(errors.internalServerError.code);
    }
  }
}

module.exports = new DocumentReport();
