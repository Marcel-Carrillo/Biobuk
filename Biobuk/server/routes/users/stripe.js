var express = require("express");
const stripeControllers = require('../../controllers/users/stripeControllers');
var router = express.Router();

// Traer la public key
//localhost:4000/users/stripe/publicKey
router.get("/publicKey", stripeControllers.stripePublic)

// Crear un cargo
//localhost:4000/users/stripe
router.post('/', stripeControllers.stripe);


module.exports = router;