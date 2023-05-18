var express = require("express");
const adminControllers = require("../../controllers/users/adminControllers");
var router = express.Router();

// Trae los datos de los agricultores
//localhost:4000/users/admin/getAllFarmers
router.get("/getAllFarmers", adminControllers.getAllFarmers)

// Trae la lista de agricultores que usan un producto específico
//localhost:4000/users/admin/getAllFarmersProduct/:id
router.get("/getAllFarmersProduct/:id", adminControllers.getAllFarmersProduct)

// Crear Sectores
//localhost:4000/users/admin/createZone/:id_user/:id_greenhouse
router.post("/createZone/:id_user/:id_greenhouse", adminControllers.createZone)

// Habilitar agricultores
//localhost:4000/users/admin/enableUser/:id
router.put("/enableUser/:id", adminControllers.enableUser)

// Deshabilitar agricultores
//localhost:4000/users/admin/disableUser/:id
router.put("/disableUser/:id", adminControllers.disableUser)

// Borrar un comentario
//localhost:4000/users/admin/deleteComment/:commentary_id/:product_id
router.post("/deleteComment/:commentary_id/:product_id", adminControllers.deleteComment)

// Conteo de usuarios, productos e invernaderos
//localhost:4000/users/admin/getAllCount
router.get("/getAllCount", adminControllers.getAllCount)

// Editar invernadero por parte de administrador
//localhost:4000/users/admin/editGreenhouse/:greenhouse_id
router.put("/editGreenhouse/:greenhouse_id", adminControllers.editGreenhouse)

// Ver todos los invernaderos
// localhost:4000/users/admin/getAllGreenhouses
router.get("/getAllGreenhouses", adminControllers.getAllGreenhouses)


module.exports = router;
