const Router = require("express").Router;
const router = new Router();
const setFilterFromClient = require('../filteringAndMiddleware/sequelizeFiltering')

const controller = require("../controllers/documentRoute.controller");

router.get("/", controller.getAllDocumentRoute);
router.post("/add", controller.addNewDocumentRoute);

module.exports = router;
