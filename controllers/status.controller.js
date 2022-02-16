const db = require('../models')
const { Status, Sequelize } = db
const { ValidationError } = Sequelize
const errors = require('../utils/errors')
const { StatusAssociation } = require('../filteringAndMiddleware/associations')
const log = require('../loggers/eventLog')

class StatusController {
    async getAllStatusesWithFiltering(req, res) {
        try {
            const statuses = await Status.findAll({ ...req.filter, include: StatusAssociation })
            return res
                .status(errors.success.code)
                .json(statuses)
        } catch (e) {
            return res
                .sendStatus(errors.internalServerError.code)
        }
    }

    async getStatusByStatusId(req, res) {
        try {
            const status = await Status.findByPk(req.params.statusId, { include: StatusAssociation })
            if (!status) {
                return res
                    .sendStatus(errors.notFound.code)
            }

            return res
                .status(errors.success.code)
                .json(status)
        } catch (e) {
            return res
                .status(errors.internalServerError.code)
        }
    }

    async addNewStatus(req, res) {
        try {
            const result = await Status.create({ ...req.body }, { include: StatusAssociation })
            log(req, `status [id:${result.dataValues.id}/${result.dataValues.value}/${result.dataValues.description}] created`, true)
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

    async updateStatusByStatusId(req, res) {
        try {
            const status = await Status.findByPk(req.params.statusId, { include: StatusAssociation })
            if (!status) {
                return res
                    .sendStatus(errors.notFound.code)
            }
            await status.update({ ...req.body })
            return res
                .status(errors.success.code)
                .json(status)
        } catch (e) {
            if (e instanceof ValidationError) {
                return res
                    .sendStatus(errors.badRequest.code)
            }
            return res
                .sendStatus(errors.internalServerError.code)
        }
    }

    async deleteStatusByStatusId(req, res) {
        try {
            const status = await Status.findByPk(req.params.statusId)
            if (!status) {
                return res
                    .sendStatus(errors.notFound.code)
            }
            await status.destroy()
            return res
                .sendStatus(errors.success.code)
        } catch (e) {
            return res
                .sendStatus(errors.internalServerError.code)
        }
    }
}

module.exports = new StatusController()