const connection = require("../../config/db");

class ownerControllers {
  /**
   * Recoge la información de todos los pedidos de los productos que han hecho los agricultores en la tienda de un propietario.
   */
  //localhost:4000/users/owner/getAllOrders/:owner_id
  getAllOrders = (req, res) => {
    let { owner_id } = req.params;
    let sql = ` SELECT 
        shipping_address.address AS 'shipping_address',order_id,buyer_id,shop_product.shop_product_id,biobuk.order.shipping_address_id,purchase_date,quantity,original_price,shop.shop_id,shop.name AS 'shop_name',shop.address AS 'shop_address',shop.city AS "shop_city",owner_user_id,price,stock,product.name AS 'product_name',reference,crop_type
    FROM
        shipping_address,biobuk.order,shop,shop_product,product
    WHERE
        shipping_address.shipping_address_id = order.shipping_address_id AND shop_product.product_id = product.product_id AND biobuk.order.shop_product_id = shop_product.shop_product_id AND shop_product.shop_id = shop.shop_id AND shop.owner_user_id = ${owner_id} ORDER BY order_id DESC;`;
    connection.query(sql, (error, result) => {
      error ? res.status(400).json(error) : res.status(200).json(result);
    });
  };

  /**
   * Recoge todos los productos de un pedido que ha hecho un agricultor de todas sus tiendas.
   */
  //localhost:4000/users/owner/getOneFarmerOrder/:order_id/:owner_id
  getOneFarmerOrder = (req, res) => {
    let { order_id, owner_id } = req.params;
    let sql = `SELECT shop.name as "shop_name",user.name as "name", shipping_address.address as "destination", purchase_date, quantity, original_price, product.product_id, shop_product.shop_product_id, biobuk.order.order_id, product.name as "product_name",  reference, price, stock FROM shop, user, shipping_address, biobuk.order, product, shop_product where order_id = ${order_id} AND shop_product.shop_product_id = biobuk.order.shop_product_id AND shop_product.product_id = product.product_id AND shipping_address.shipping_address_id = biobuk.order.shipping_address_id AND user.user_id = biobuk.order.buyer_id AND shop.shop_id = shop_product.shop_id AND shop.owner_user_id = ${owner_id} ORDER BY order_id DESC`;
    connection.query(sql, (err, result) => {
      err ? res.status(400).json(err) : res.status(200).json(result);
    });
  };
}

module.exports = new ownerControllers();
