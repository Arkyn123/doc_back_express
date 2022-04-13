const Router = require("express").Router;
const router = new Router();
const setFilterFromClient = require('../filteringAndMiddleware/sequelizeFiltering')
const { permissions } = require('../filteringAndMiddleware/middleware')
const controller = require("../controllers/dicOfficeCorrespondence.controller");

router.get("/", permissions, setFilterFromClient, controller.getAll);
router.post("/add", permissions, controller.addInDictionary);
router.put(`/update/:id`, permissions, controller.saveInDictionary)
router.put(`/delete/:id`, permissions, controller.delInDictionary)
module.exports = router;
