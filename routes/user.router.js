const Router = require('express').Router
const router = new Router()

const controller = require('../controllers/user.controller')

const { permissions } = require('../filteringAndMiddleware/middleware')

router.get('/', permissions,  controller.getUser)

module.exports = router