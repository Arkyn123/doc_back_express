const Router = require("express").Router;
const router = new Router();
const setFilterFromClient = require('../filteringAndMiddleware/sequelizeFiltering')
const { permissions } = require('../filteringAndMiddleware/middleware')

const controller = require("../controllers/documentType.controller");

router.get("/", permissions, controller.getAllDocumentType);
router.post("/add", permissions, setFilterFromClient, controller.addNewDocumentType);
module.exports = router;
