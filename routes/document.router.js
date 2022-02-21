const Router = require("express").Router;
const router = new Router();
const setFilterFromClient = require('../filteringAndMiddleware/sequelizeFiltering')

const controller = require("../controllers/document.controller");

router.get("/", setFilterFromClient, controller.getAllDocument);
router.post("/add", controller.addNewDocument);

module.exports = router;
