const Router = require("express").Router;
const router = new Router();
const setFilterFromClient = require('../filteringAndMiddleware/sequelizeFiltering')
const { permissions } = require('../filteringAndMiddleware/middleware')
const controller = require("../controllers/document.controller");

router.get("/", permissions, setFilterFromClient, controller.getAllDocument);
router.get("/:documentId", permissions, controller.getDocumentById);
router.post("/add", permissions, controller.addNewDocument);
router.post("/addInDraft", permissions, controller.addNewDocumentInDraft);
router.put('/update/:documentId', permissions, controller.updateDocumentByDocumentId)
router.put('/updateFromDraftAndRevision/:documentId', permissions, controller.updateDocumentFromDraftAndRevisionByDocumentId)
// router.put('/updateDocumentAdmin/:documentId', permissions, controller.updateDocumentAdmin)
router.delete('/delete', permissions, controller.deleteAllDocuments)

module.exports = router;
