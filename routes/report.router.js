const Router = require("express").Router;
const router = new Router();
const controller = require("../controllers/report.controller");

router.post("/", controller.getAllDocumentsInfo);


module.exports = router;