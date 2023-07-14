const Router = require("express").Router;
const router = new Router();
const setFilterFromClient = require("../filteringAndMiddleware/sequelizeFiltering");
const { permissions } = require("../filteringAndMiddleware/middleware");

const controller = require("../controllers/documentRoute.controller");

router.get("/", permissions, controller.getAllDocumentRoute);
router.get(
  "/:documentTypeId",
  permissions,
  controller.getDocumentRouteByDocumentTypeId
);
router.post("/add", permissions, controller.addNewDocumentRoute);
router.delete(
  "/delete/:documentTypeId",
  permissions,
  controller.deleteDocumentRouteById
);

module.exports = router;
