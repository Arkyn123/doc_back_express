const Router = require("express").Router;
const router = new Router();
const setFilterFromClient = require('../filteringAndMiddleware/sequelizeFiltering')
const { permissions } = require('../filteringAndMiddleware/middleware')
const controller = require("../controllers/findScheduleMSSQL.controller");

router.get("/", permissions, controller.getAllSchedule);

module.exports = router;
