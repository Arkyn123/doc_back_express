const Router = require("express").Router;
const router = new Router();
const setFilterFromClient = require('../filteringAndMiddleware/sequelizeFiltering')
const { permissions } = require('../filteringAndMiddleware/middleware')
const controller = require("../controllers/document.controller");

router.get("/", setFilterFromClient, controller.getAllDocument);
router.get("/:documentId", controller.getDocumentById);
router.post("/add", controller.addNewDocument);
router.post("/addInDraft", controller.addNewDocumentInDraft);
router.put('/update/:documentId', permissions, controller.updateDocumentByDocumentId)
router.put('/updateFromDraftAndRevision/:documentId', permissions, controller.updateDocumentFromDraftAndRevisionByDocumentId)
router.delete('/delete', controller.deleteAllDocuments)

module.exports = router;
