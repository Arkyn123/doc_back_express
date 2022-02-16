const Router = require('express').Router
const router = new Router()

const controller = require('../controllers/routeCoordination.controller')

// const setFilterFromClient = require('../filteringAndMiddleware/sequelizeFiltering')
// const { permissions } = require('../filteringAndMiddleware/middleware')

router.get('/', controller.getAllRoutes)
router.post('/add', controller.addNewRoute)

module.exports = router