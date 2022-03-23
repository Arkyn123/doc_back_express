const dbMSSQL = require("../modelsMSSQL");
const { DIC_OFFICE, SequelizeMSSQL } = dbMSSQL;
const { ValidationError } = SequelizeMSSQL;
const errors = require("../utils/errors");
const {
  RouteCoordinationAssociation,
} = require("../filteringAndMiddleware/associations");

class DicOfficeController {
  async getAll(req, res) {
    try {
      const filter = { ...req.filter };
      if (!filter.where) {
        filter.where = {};
      } else {
        filter.where = { ...filter.where };
      }
      const dic_office = await DIC_OFFICE.findAll({
        ...filter,
        include: [{ all: true, nested: true, duplicating: true }],
      });
      //   console.warn(b.map(a => a.dataValues));
      return res.status(errors.success.code).json(dic_office);
    } catch (e) {
      console.log(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }
  async addInDictionary(req, res) {
    try {
      const dic_office = await DIC_OFFICE.create({
        ...req.body,
        CreatedDate: Date.now(),
        FlagDeleted: false,
      });
      return res.status(errors.success.code).json(dic_office);
    } catch (e) {
      return res.sendStatus(errors.internalServerError.code);
    }
  }
  async saveInDictionary(req, res) {
    try {
      const dic_office = await DIC_OFFICE.findByPk(req.params.id);
      if (!dic_office) {
        return res.sendStatus(errors.notFound.code);
      }
      await dic_office.update({
        ...req.body,
        UpdatedDate: Date.now(),
      });
      return res.status(errors.success.code).json(dic_office);
    } catch (e) {
      console.log(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }
  async delInDictionary(req, res) {
    try {
      const dic_office = await DIC_OFFICE.findByPk(req.params.id);
      if (!dic_office) {
        return res.sendStatus(errors.notFound.code);
      }
      await dic_office.update({
        DeletedDate: Date.now(),
        FlagDeleted: true,
      });
      return res.sendStatus(errors.success.code);
    } catch (e) {
      console.log(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }
}
module.exports = new DicOfficeController();
