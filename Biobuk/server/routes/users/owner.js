var express = require("express");
const ownerControllers = require("../../controllers/users/ownerControllers");
var router = express.Router();

//localhost:4000/users/owner/getAllOrders/:owner_id
router.get("/getAllOrders/:owner_id", ownerControllers.getAllOrders)

//localhost:4000/users/owner/getOneFarmerOrder/:order_id/:owner_id
router.get("/getOneFarmerOrder/:order_id/:owner_id", ownerControllers.getOneFarmerOrder)

module.exports = router;

