const Router = require("express").Router;
const router = new Router();
const setFilterFromClient = require('../filteringAndMiddleware/sequelizeFiltering')

const controller = require("../controllers/dicOfficeCorrespondence.controller");

router.get("/", setFilterFromClient, controller.getAll);
router.post("/add", controller.addInDictionary);
router.put(`/update/:id`, controller.saveInDictionary)
router.put(`/delete/:id`, controller.delInDictionary)
module.exports = router;
