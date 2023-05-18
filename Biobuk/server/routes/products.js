var express = require("express");
const multer = require("../middleware/multer");
const productsControllers = require("../controllers/productsControllers");
var router = express.Router();

// Trae los datos de los productos
//localhost:4000/products/getAllProducts
router.get("/getAllProducts", productsControllers.getAllProducts);

// Trae los datos de un producto
//localhost:4000/products/getOneProduct/:id
router.get("/getOneProduct/:id", productsControllers.getOneProduct);

// Crea un producto
//localhost:4000/products/createProduct/:user_id
router.post("/createProduct/:user_id", multer("productos"), productsControllers.createProduct);

// Editar producto fitosanitario
//localhost:4000/products/editProduct/:product_id
router.put("/editProduct/:product_id", multer("productos"), productsControllers.editProduct);

// Eliminar lógicamente producto fitosanitario
//localhost:4000/products/deleteProduct/:id
router.put("/deleteProduct/:product_id", productsControllers.deleteProduct);

// Ver todos los comentarios
//localhost:4000/products/comments/:product_id
router.get("/comments/:product_id", productsControllers.viewComments)

// Eliminar una imagen de un producto fitosanitario
// localhost:4000/products/deleteImg/:product_img_id
router.put('/deleteImg/:product_img_id', productsControllers.deleteImg)

// Ver información de tiendas y sus precios de un producto concreto
// localhost:4000/products/getShopsPrices/:product_id
router.get("/getShopsPrices/:product_id", productsControllers.getShopsPrices)

module.exports = router;