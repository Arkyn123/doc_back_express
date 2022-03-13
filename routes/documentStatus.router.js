const Router = require('express').Router
const router = new Router()

const controller = require('../controllers/documentStatus.controller')

// const setFilterFromClient = require('../filteringAndMiddleware/sequelizeFiltering')
// const { permissions } = require('../filteringAndMiddleware/middleware')

router.get('/', controller.getAllStatusesWithFiltering)
router.get('/view/:statusId', controller.getStatusByStatusId)
router.post('/add', controller.addNewStatus)
router.put('/update/:statusId', controller.updateStatusByStatusId)
router.delete('/delete/:statusId', controller.deleteStatusByStatusId)

module.exports = router