const Router = require("express").Router;
const router = new Router();
const { permissions } = require("../filteringAndMiddleware/middleware");
const controller = require("../controllers/file.controller");

router.get("/", controller.getFiles);
router.get("/:id", controller.getFileById);
router.post("/add", controller.addNewFile);
router.put("/delete/:id", controller.deleteFile);

module.exports = router;
