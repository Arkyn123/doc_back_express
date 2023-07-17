const Router = require("express").Router;
const router = new Router();
const { permissions } = require("../filteringAndMiddleware/middleware");
const controller = require("../controllers/findMSSQL.controller");

router.get("/schedule", permissions, controller.getAllSchedule);
router.get("/brigada", permissions, controller.getAllBrigada);
router.get("/brigades", controller.getAllBrigades);
module.exports = router;
