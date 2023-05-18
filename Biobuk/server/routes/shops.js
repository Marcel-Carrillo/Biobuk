var express = require("express");
const multerSingle = require("../middleware/multerSingle");
const shopsControllers = require("../controllers/shopsControllers");
var router = express.Router();

//Añadir una tienda
//localhost:4000/shops/createShop/:user_id
router.post("/createShop/:user_id", multerSingle("tienda"), shopsControllers.createShop);

//Editar una tienda
//localhost:4000/shops/editShop/:user_id/:shop_id
router.put("/editShop/:user_id/:shop_id", multerSingle("tienda"), shopsControllers.editShop);

//Obtener información de las tiendas de un propietario
//localhost:4000/shops/getAllOwnerShops/:user_id
router.get("/getAllOwnerShops/:user_id", shopsControllers.getAllOwnerShops);

//Obtener la información de una tienda
//localhost:4000/shops/getOneShop/:shop_id
router.get("/getOneShop/:shop_id", shopsControllers.getOneShop);

//Obtener los productos a la venta de una tienda
//localhost:4000/shops/getShopProducts/:shop_id
router.get("/getShopProducts/:shop_id", shopsControllers.getShopProducts);

//Editar un producto de una tienda
//localhost:4000/shops/editShopProduct/:shop_id/:shop_product_id
router.put("/editShopProduct/:shop_id/:shop_product_id", shopsControllers.editShopProduct)

//Elimnar producto de una tienda
//localhost:4000/shops/deleteShopProduct/:shop_id/:shop_product_id
router.put("/deleteShopProduct/:shop_id/:shop_product_id", shopsControllers.deleteShopProduct);

//Añadir un producto a una tienda
//localhost:4000/shops/addProductToShop/:shop_id/:product_id
router.post("/addProductToShop/:shop_id/:product_id", shopsControllers.addProductToShop)

//Borrar una tienda
//localhost:4000/shops/deleteShop/:id
router.put("/deleteShop/:id", shopsControllers.deleteShop)


module.exports = router;
