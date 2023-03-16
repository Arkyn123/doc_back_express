const db = require('../models')
const { DocumentStatus, Sequelize } = db
const { ValidationError } = Sequelize
const errors = require('../utils/errors')

class DocumentStatusController {
    async getAllStatuses(req, res) {
        try {
            const statuses = await DocumentStatus.findAll()
            return res
                .status(errors.success.code)
                .json(statuses)
        } catch (e) {
            return res
                .sendStatus(errors.internalServerError.code)
        }
    }

    // async getStatusByStatusId(req, res) {
    //     try {
    //         const status = await DocumentStatus.findByPk(req.params.statusId, { include: StatusAssociation })
    //         if (!status) {
    //             return res
    //                 .sendStatus(errors.notFound.code)
    //         }

    //         return res
    //             .status(errors.success.code)
    //             .json(status)
    //     } catch (e) {
    //         return res
    //             .status(errors.internalServerError.code)
    //     }
    // }

    async addNewStatus(req, res) {
        try {
            const result = await DocumentStatus.create({ ...req.body })
            return res
                .status(errors.success.code)
                .json(result.dataValues)
        } catch (e) {
            if (e instanceof ValidationError) {
                return res
                    .sendStatus(errors.badRequest.code)
            }
            return res
                .sendStatus(errors.internalServerError.code)
        }
    }

    // async updateStatusByStatusId(req, res) {
    //     try {
    //         const status = await DocumentStatus.findByPk(req.params.statusId, { include: StatusAssociation })
    //         if (!status) {
    //             return res
    //                 .sendStatus(errors.notFound.code)
    //         }
    //         await status.update({ ...req.body })
    //         return res
    //             .status(errors.success.code)
    //             .json(status)
    //     } catch (e) {
    //         if (e instanceof ValidationError) {
    //             return res
    //                 .sendStatus(errors.badRequest.code)
    //         }
    //         return res
    //             .sendStatus(errors.internalServerError.code)
    //     }
    // }

    // async deleteStatusByStatusId(req, res) {
    //     try {
    //         const status = await DocumentStatus.findByPk(req.params.statusId)
    //         if (!status) {
    //             return res
    //                 .sendStatus(errors.notFound.code)
    //         }
    //         await status.destroy()
    //         return res
    //             .sendStatus(errors.success.code)
    //     } catch (e) {
    //         return res
    //             .sendStatus(errors.internalServerError.code)
    //     }
    // }
}

module.exports = new DocumentStatusController()