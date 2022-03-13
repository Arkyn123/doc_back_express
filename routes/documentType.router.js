const Router = require("express").Router;
const router = new Router();
const setFilterFromClient = require('../filteringAndMiddleware/sequelizeFiltering')

const controller = require("../controllers/documentType.controller");

router.get("/", controller.getAllDocumentType);
router.post("/add", controller.addNewDocumentType);

module.exports = router;
