const Router = require("express").Router;
const router = new Router();
const setFilterFromClient = require('../filteringAndMiddleware/sequelizeFiltering')

const controller = require("../controllers/documentRoute.controller");

router.get("/", controller.getAllDocumentRoute);
router.get("/:documentTypeId", controller.getDocumentRouteByDocumentTypeId);
router.post("/add", controller.addNewDocumentRoute);
router.delete('/delete/:documentTypeId', controller.deleteDocumentRouteById);

module.exports = router;
