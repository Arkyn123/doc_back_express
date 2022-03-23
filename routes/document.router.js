const Router = require("express").Router;
const router = new Router();
const setFilterFromClient = require('../filteringAndMiddleware/sequelizeFiltering')
const { permissions } = require('../filteringAndMiddleware/middleware')
const controller = require("../controllers/document.controller");

router.get("/", setFilterFromClient, controller.getAllDocument);
router.get("/:documentId", controller.getDocumentById);
router.post("/add", controller.addNewDocument);
router.put('/update/:documentId', permissions, controller.updateDocumentByDocumentId)

module.exports = router;
