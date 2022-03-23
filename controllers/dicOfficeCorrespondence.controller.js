const dbMSSQL = require("../modelsMSSQL");
const { DIC_OFFICE_CORRESPONDENCE, SequelizeMSSQL } = dbMSSQL;
const { ValidationError } = SequelizeMSSQL;
const errors = require("../utils/errors");
const {
  RouteCoordinationAssociation,
} = require("../filteringAndMiddleware/associations");

class DicOfficeCorrespondenceController {
  async getAll(req, res) {
    try {
      const filter = { ...req.filter };
      console.log(filter);
      if (!filter.where) {
        filter.where = {};
      } else {
        filter.where = { ...filter.where };
      }
      const dic_office_correspondence = await DIC_OFFICE_CORRESPONDENCE.findAll({
        ...filter,
        include: [{ all: true, nested: true, duplicating: true }],
      });
      return res.status(errors.success.code).json(dic_office_correspondence);
    } catch (e) {
      return res.sendStatus(errors.internalServerError.code);
    }
  }
  async addInDictionary(req, res) {
    try {
      const dic_office_correspondence = await DIC_OFFICE_CORRESPONDENCE.create({...req.body, CreatedDate: Date.now(), FlagDeleted: false});
      return res.status(errors.success.code).json(dic_office_correspondence);
    } catch (e) {
      return res.sendStatus(errors.internalServerError.code);
    }
  }
  async saveInDictionary(req, res) {
    try {
      const dic_office_correspondence = await DIC_OFFICE_CORRESPONDENCE.findByPk(req.params.id);
      if (!dic_office_correspondence) {
        return res.sendStatus(errors.notFound.code);
      }
      await dic_office_correspondence.update({
        ...req.body, UpdatedDate: Date.now()
      });
      return res.status(errors.success.code).json(dic_office_correspondence);
    } catch (e) {
      console.log(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }
  async delInDictionary(req, res) {
    try {
        const dic_office_correspondence = await DIC_OFFICE_CORRESPONDENCE.findByPk(req.params.id)
        if (!dic_office_correspondence) {
            return res
                .sendStatus(errors.notFound.code)
        }
        await dic_office_correspondence.update({
          DeletedDate: Date.now(), FlagDeleted: true
        });
        return res
            .sendStatus(errors.success.code)
    } catch (e) {
        return res
            .sendStatus(errors.internalServerError.code)
    }
}
}
module.exports = new DicOfficeCorrespondenceController();
