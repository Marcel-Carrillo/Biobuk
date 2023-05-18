var express = require("express");
const multer = require("../../middleware/multer");
const farmerControllers = require("../../controllers/users/farmerControllers");
var router = express.Router();


// Crear un invernadero
//localhost:4000/users/farmer/createGreenhouse/:id
router.post("/createGreenhouse/:id", multer("greenhouses"), farmerControllers.createGreenhouse)

// Editar un invernadero
//localhost:4000/users/farmer/editGreenhouse/:id
router.put("/editGreenhouse/:id", farmerControllers.editGreenhouse)

// Eliminar un invernadero
//localhost:4000/users/farmer/deleteGreenhouse/:id
router.post("/deleteGreenhouse/:id", farmerControllers.deleteGreenhouse)

// Ver productos aplicados en el sector
//localhost:4000/users/farmer/showZoneProducts/:zone_id
router.get("/getZoneProducts/:zone_id", farmerControllers.getZoneProducts);

// Añadir un producto al sector
//localhost:4000/users/farmer/addProductToZone/:zone_id
router.post("/addProductToZone/:zone_id", farmerControllers.addProductToZone)

// Eliminar un producto del sector
//localhost:4000/users/farmer/deleteProductInZone/:id_zone/:id_product
router.post("/deleteProductInZone/:zone_id/:product_id", farmerControllers.deleteProductInZone)

// Editar un producto del sector
//localhost:4000/users/farmer/editProductInZone/:id_zone/:id_product
router.put("/editProductInZone/:zone_id/:product_id", farmerControllers.editProductInZone)

// Postear un comentario
//localhost:4000/users/farmer/postComment/:user_id/:product_id
router.post("/postComment/:user_id/:product_id", farmerControllers.postComment)

// Añadir dirección postal
//localhost:4000/users/farmer/addShippingAddress/:id
router.post("/addShippingAddress/:user_id", farmerControllers.addShippingAddress)

// Ver dirección postal
//localhost:4000/users/farmer/getShippingAddress/:shipping_address_id
router.get("/getShippingAddress/:shipping_address_id", farmerControllers.getShippingAddress)

// Borrar dirección postal
//localhost:4000/users/farmer/deleteShippingAddress/:shipping_address_id
router.put("/deleteShippingAddress/:shipping_address_id", farmerControllers.deleteShippingAddress)

// Añadir un producto al carrito de compra
//localhost:4000/users/farmer/addProductToCart/:buyer_id/:shop_product_id
router.post("/addProductToCart/:buyer_id/:shop_product_id", farmerControllers.addProductToCart)

// Ver carrito de la compra
//localhost:4000/users/farmer/getShoppingCart/:buyer_id
router.get("/getShoppingCart/:buyer_id", farmerControllers.getShoppingCart)

// Restar o sumar en uno cantidad de un producto del carrito
//localhost:4000/users/farmer/newQuantity/:buyer_id/:shop_product_id
router.put("/newQuantity/:buyer_id/:shop_product_id", farmerControllers.newQuantity)

// Borrar un producto del carrito
//localhost:4000/users/farmer/deleteCartProduct/:buyer_id/:shop_product_id
router.delete("/deleteCartProduct/:buyer_id/:shop_product_id", farmerControllers.deleteCartProduct)

// Obtener direcciones de envío de un agricultor
//localhost:4000/users/farmer/getShippingAddresses/:user_id
router.get("/getShippingAddresses/:user_id", farmerControllers.getShippingAddresses)

// Hacer un pedido
//localhost:4000/users/farmer/newOrder/:user_id/:shipping_address_id
router.post("/newOrder/:user_id/:shipping_address_id", farmerControllers.newOrder)

// Información en un recibo de una compra realizada
//localhost:4000/users/farmer/orderReceipt/:order_id
router.get("/orderReceipt/:order_id", farmerControllers.orderReceipt)

//Ver lista de pedidos
//localhost:4000/users/farmer/getAllOrders/:buyer_id
router.get("/getAllOrders/:buyer_id", farmerControllers.getAllOrders)

//ver un pedido
//localhost:4000/users/farmer/getOneOrder/:order_id
router.get("/getOneOrder/:order_id", farmerControllers.getOneOrder)

module.exports = router;
