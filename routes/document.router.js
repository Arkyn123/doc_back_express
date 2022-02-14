const Router = require("express").Router;
const router = new Router();

const controller = require("../controllers/document.controller");

router.get("/", controller.getAllDocument);
router.post("/add", controller.addNewDocument);

module.exports = router;
