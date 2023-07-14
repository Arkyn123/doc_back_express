const Router = require("express").Router;
const router = new Router();
// const setFilterFromClient = require('../filteringAndMiddleware/sequelizeFiltering')
const { permissions } = require("../filteringAndMiddleware/middleware");

const controller = require("../controllers/documentStatus.controller");

router.get("/", permissions, controller.getAllStatuses);
router.post("/add", permissions, controller.addNewStatus);
module.exports = router;
