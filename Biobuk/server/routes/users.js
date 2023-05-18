var express = require("express");
const multerSingle = require("../middleware/multerSingle");
const userControllers = require("../controllers/userControllers");
var router = express.Router();

// Login 
//localhost:4000/users/login
router.post("/login", userControllers.login)

// Registrar un usuario
//localhost:4000/users/register
router.post("/register", userControllers.register)

// Editar su información de perfil
//localhost:4000/users/editOneUser/:id
router.put("/editOneUser/:id", multerSingle("users"), userControllers.editOneUser)

// Ver información de un perfil
//localhost:4000/users/getOneUser/:id
router.get("/getOneUser/:user_id", userControllers.getOneUser)

// Confirmación de cuenta
//localhost:4000/users/activeAcount/:user_id
router.put("/activeAccount/:user_id", userControllers.activeAccount)

module.exports = router;
