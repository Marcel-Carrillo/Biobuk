const connection = require("../config/db");

class shopControllers {
  // Metodo para crear una tienda para un propietario
  //localhost:4000/shops/createShop/:user_id
  createShop = (req, res) => {
    const user_id = req.params.user_id;
    const { name, address, city, province, country } = JSON.parse(
      req.body.newShop
    );

    let sql = `INSERT INTO shop (name, address, city, province, country, owner_user_id) VALUES ('${name}', '${address}', '${city}', '${province}', '${country}', '${user_id}')`;

    if (req.file != undefined) {
      sql = `INSERT INTO shop (name, address, city, province, country, shop_img, owner_user_id) VALUES ('${name}', '${address}', '${city}', '${province}', '${country}', '${req.file.filename}', ${user_id})`;
    }

    let sqlShops = `SELECT * FROM shop WHERE owner_user_id = ${user_id}`;

    connection.query(sql, (error, result) => {
      if (error) {
        res.status(400).json({ error });
      }
      connection.query(sqlShops, (errorShop, resultShop) => {
        errorShop
          ? res.status(400).json({ errorShop })
          : res.status(200).json(resultShop);
      });
    });
  };


  // Metodo para editar la información de una tienda
  //localhost:4000/shops/editShop/:user_id/:shop_id
  editShop = (req, res) => {
    const user_id = req.params.user_id;
    const shop_id = req.params.shop_id;
    const { name, address, city, province, country } = JSON.parse(
      req.body.newShop
    );

    let sql = `UPDATE shop SET name = '${name}', address = '${address}', city = '${city}', province = '${province}', country = '${country}' WHERE shop_id = ${shop_id}`;

    if (req.file != undefined) {
      sql = `UPDATE shop SET name = '${name}', address = '${address}', city = '${city}', province = '${province}', country = '${country}', shop_img = '${req.file.filename}' WHERE shop_id = ${shop_id}`;
    }

    let sqlShops = `SELECT * FROM shop WHERE owner_user_id = ${user_id}`;
    connection.query(sql, (error, result) => {
      if (error) {
        res.status(400).json({ error });
      }
      connection.query(sqlShops, (errorShop, resultShop) => {
        errorShop
          ? res.status(400).json({ errorShop })
          : res.status(200).json(resultShop);
      });
    });
  };


  // Metodo para obtener la información de todas las tiendas de un propietario
  //localhost:4000/shops/getAllOwnerShops
  getAllOwnerShops = (req, res) => {
    const user_id = req.params.user_id;

    let sql = `SELECT * FROM shop WHERE owner_user_id = ${user_id} and deleted=0`;

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };


  // Metodo para obetner la información de una tienda especifica
  //localhost:4000/shops/getOneShop/:shop_id
  getOneShop = (req, res) => {
    const shop_id = req.params.shop_id;

    let sql = `SELECT * FROM shop WHERE shop_id = ${shop_id}`;

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };


  // Metodo para obtener la información de los productos a la venta de una tienda
  //localhost:4000/shops/getShopProducts/:shop_id
  getShopProducts = (req, res) => {
    const shop_id = req.params.shop_id;

    let sql = `SELECT shop_product.shop_product_id, shop_product.product_id, shop_product.price, shop_product.stock, product.name, product.reference, product.minimum_amount FROM shop_product, product WHERE shop_product.product_id = product.product_id AND shop_product.shop_id = ${shop_id} AND shop_product.deleted = 0;`;

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };


  // Metodo para editar la información de un producto a la venta de una tienda
  //localhost:4000/shops/editShopProduct/:shop_id/:shop_product_id
  editShopProduct = (req, res) => {
    const shop_id = req.params.shop_id;
    const shop_product_id = req.params.shop_product_id;
    const { price, stock } = req.body;

    let sql = `UPDATE shop_product SET price = ${price} , stock = ${stock} WHERE shop_product_id = ${shop_product_id}`;
    let sqlShopProducts = `SELECT shop_product.shop_product_id, shop_product.product_id, shop_product.price, shop_product.stock, product.name, product.reference FROM shop_product, product WHERE shop_product.product_id = product.product_id AND shop_product.shop_id = ${shop_id} AND shop_product.deleted = 0;`;

    connection.query(sql, (error, result) => {
      if (error) {
        res.status(400).json({ error });
      }
      connection.query(sqlShopProducts, (errorShop, resultShop) => {
        errorShop
          ? res.status(400).json({ errorShop })
          : res.status(200).json(resultShop);
      });
    });
  };


  // Metodo para borrar un producto a la venta de una tienda
  //localhost:4000/shops/deleteShopProduct/:shop_id/:shop_product_id
  deleteShopProduct = (req, res) => {
    const shop_id = req.params.shop_id;
    const shop_product_id = req.params.shop_product_id;

    let sql = `UPDATE shop_product SET deleted = true WHERE shop_product_id = ${shop_product_id}`;
    let sqlShopProducts = `SELECT shop_product.shop_product_id, shop_product.product_id, shop_product.price, shop_product.stock, product.name, product.reference FROM shop_product, product WHERE shop_product.product_id = product.product_id AND shop_product.shop_id = ${shop_id} AND shop_product.deleted = 0;`;

    connection.query(sql, (error, result) => {
      if (error) {
        res.status(400).json({ error });
      }
      connection.query(sqlShopProducts, (errorShop, resultShop) => {
        errorShop
          ? res.status(400).json({ errorShop })
          : res.status(200).json(resultShop);
      });
    });
  };


  // Metodo para añadir un producto a la venta en una tienda
  //localhost:4000/shops/addPrice/:id
  addProductToShop = (req, res) => {
    const shop_id = req.params.shop_id;
    const product_id = req.params.product_id;

    const { price, stock } = req.body;

    let sql = `INSERT INTO shop_product (shop_id, product_id, price, stock) VALUES (${shop_id}, ${product_id}, ${price}, ${stock})`;
    let sqlShopProducts = `SELECT shop_product.shop_product_id, shop_product.product_id, shop_product.price, shop_product.stock, product.name, product.reference FROM shop_product, product WHERE shop_product.product_id = product.product_id AND shop_product.shop_id = ${shop_id} AND shop_product.deleted = 0;`;

    connection.query(sql, (error, result) => {
      if (error) {
        res.status(400).json({ error });
      }
      connection.query(sqlShopProducts, (errorShop, resultShop) => {
        errorShop
          ? res.status(400).json({ errorShop })
          : res.status(200).json(resultShop);
      });
    });
  };


  // Borrar una tienda
  //localhost:4000/shops/deleteShop/:id
  deleteShop = (req, res) => {
    const { id } = req.params
    let sql = `UPDATE shop SET deleted = 1 WHERE shop_id = ${id}`

    connection.query(sql, (error, result) => {
      error ? res.status(400).json(error) : res.status(200).json("oki")
    })
  }
}

module.exports = new shopControllers();
