const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

// Client routes
router.get("/", clientController.getClients);
router.post("/", clientController.addClient);
router.put("/:id", clientController.updateClient);
router.delete("/:id", clientController.deleteClient);

// Add this to your router (make sure clientId is passed as a URL parameter)
router.put("/:clientId/remove-product", clientController.removeProductFromClient);

module.exports = router;
