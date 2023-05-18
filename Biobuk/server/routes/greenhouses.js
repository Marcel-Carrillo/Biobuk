var express = require("express");
const greenhouseControllers = require("../controllers/greenhouseControllers");
var router = express.Router();

// Trae los datos de los invernaderos
//localhost:4000/greenhouses/getAllGreenhouses/:id
router.get("/getAllGreenhouses/:id", greenhouseControllers.getAllGreenhouses)

// Trae los datos de un invernadero
//localhost:4000/greenhouses/getOneGreenhouse/:greenhouse_id
router.get("/getOneGreenhouse/:greenhouse_id", greenhouseControllers.getOneGreenhouse)

// Ver los sectores de un invernadero
//localhost:4000/greenhouses/getAllZones/:greenhouse_id
router.get("/getAllZones/:greenhouse_id", greenhouseControllers.getAllZones)

// Ver un sector de un invernadero
//localhost:4000/greenhouses/getOneZone/:zone_id
router.get("/getOneZone/:zone_id", greenhouseControllers.getOneZone)


module.exports = router;
