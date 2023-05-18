const connection = require("../../config/db");

class farmerControllers {
  // Crea un invernadero
  //localhost:4000/users/farmer/createGreenhouse/:id
  createGreenhouse = (req, res) => {
    const { name_greenhouse, year, production, seed_brand, fertilize_type } =
      req.body;
    const { id } = req.params;
    let sql = `INSERT INTO greenhouse (name_greenhouse, year, production, seed_brand, fertilize_type, owner_user_id) VALUES ('${name_greenhouse}', '${year}', '${production}', '${seed_brand}', '${fertilize_type}','${id}')`;

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(201).json(result);
    });
  };

  // Edita un invernadero y recoge la información del invernadero de nuevo
  //localhost:4000/users/farmer/editGreenhouse/:id
  editGreenhouse = (req, res) => {
    let { id } = req.params;
    let { name_greenhouse, year, production, seed_brand, fertilize_type } =
      req.body;
    let sql = `UPDATE greenhouse SET name_greenhouse = "${name_greenhouse}", year = "${year}", production = "${production}", seed_brand = "${seed_brand}", fertilize_type = "${fertilize_type}" WHERE greenhouse_id = ${id}`;
    let sql2 = `SELECT * FROM greenhouse WHERE greenhouse_id = ${id}`;
    connection.query(sql, (error, result) => {
      if (error) throw error;
    });
    // Envía la información del invernadero de nuevo para que se actualice
    connection.query(sql2, (error, resultGreenhouse) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultGreenhouse);
    });
  };

  // Elimina un invernadero de manera lógica
  //localhost:4000/users/farmer/deleteGreenhouse/:id
  deleteGreenhouse = (req, res) => {
    let { id } = req.params;
    let sql = `UPDATE greenhouse SET deleted = true WHERE greenhouse_id = ${id}`;

    connection.query(sql, (error, result) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json("TODO OK");
    });
  };

  // Recoge la información de los productos aplicados en los invernaderos del agricultor
  //localhost:4000/users/farmer/getZoneProducts/:zone_id
  getZoneProducts = (req, res) => {
    const zone_id = req.params.zone_id;

    let sql = `SELECT zone_product.zone_id, zone_product.product_id, zone.zone_name, zone_product.concentration, zone_product.application_date, product.name, product.crop_type, product.composition, product.description, product.how_to_use, product.minimum_amount, product.duration FROM zone_product, product, zone WHERE zone_product.product_id = product.product_id AND zone_product.zone_id = zone.zone_id AND zone_product.zone_id = ${zone_id} AND zone_product.deleted = false;`;

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };

  // Añade un producto a la zona seleccionada
  //localhost:4000/users/farmer/addProductToZone/:id_zone
  addProductToZone = (req, res) => {
    const zone_id = req.params.zone_id;

    const { product_id, concentration, application_date } = req.body;

    let sql = `INSERT INTO zone_product (zone_id, product_id, concentration, application_date) VALUES ('${zone_id}', '${product_id}', '${concentration}',  '${application_date}')`;

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };

  // Elimina un producto concreto de una zona concreta
  //localhost:4000/users/farmer/deleteProductInZone/:id_zone/:id_product
  deleteProductInZone = (req, res) => {
    const zone_id = req.params.zone_id;
    const product_id = req.params.product_id;

    let sql = `UPDATE zone_product SET deleted = true WHERE zone_id = ${zone_id} AND product_id = ${product_id}`;

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };

  // Edita la cantidad de producto en una zona y la fecha en la que se aplicó
  //localhost:4000/users/farmer/editProductInZone/:id_zone/:id_product
  editProductInZone = (req, res) => {
    const zone_id = req.params.zone_id;
    const product_id = req.params.product_id;

    const { concentration, application_date } = req.body;

    let sql = `UPDATE zone_product SET concentration = ${concentration}, application_date = '${application_date}' WHERE zone_id = ${zone_id} AND product_id = ${product_id}`;

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };

  // Añade un comentario y selecciona la información de los comentarios para actualizar la lista
  //localhost:4000/users/farmer/postComment/:user_id/:product_id
  postComment = (req, res) => {
    const user_id = req.params.user_id;
    const product_id = req.params.product_id;
    const { commentary_text, rating } = req.body;

    let sql = `INSERT INTO commentary (user_id, product_id, commentary_text, rating) VALUES (${user_id}, ${product_id}, '${commentary_text}', '${rating}')`;
    let sql2 = `SELECT commentary.commentary_id, commentary.commentary_text, commentary.rating, commentary.product_id, commentary.user_id, user.name, user.lastname FROM commentary, user WHERE commentary.user_id = user.user_id AND commentary.product_id = ${product_id} && commentary.deleted = 0`;

    connection.query(sql, (error, result) => {
      error && res.status(400).json({ error });
      // Envía la información de la lista de comentarios nueva
      connection.query(sql2, (error, resultComments) => {
        res.status(200).json(resultComments);
      });
    });
  };

  // Añade una dirección de envío
  //localhost:4000/users/farmer/addShippingAddress/:user_id
  addShippingAddress = (req, res) => {
    const user_id = req.params.user_id;
    const { address, city, province, country } = req.body;

    let sql = `INSERT INTO shipping_address (user_id, address, city, province, country) VALUES (${user_id}, '${address}', '${city}', '${province}', '${country}')`;

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };

  // Recoge la información de la dirección de envío
  //localhost:4000/users/farmer/getShippingAddress/:shipping_address_id
  getShippingAddress = (req, res) => {
    const shipping_address_id = req.params.shipping_address_id;

    let sql = `SELECT * FROM shipping_address WHERE shipping_address_id = ${shipping_address_id}`;

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };

  // Elimina la dirección de envío
  //localhost:4000/users/farmer/deleteShippingAddress/:shipping_address_id
  deleteShippingAddress = (req, res) => {
    const shipping_address_id = req.params.shipping_address_id;

    let sql = `UPDATE shipping_address SET deleted = true WHERE shipping_address_id = ${shipping_address_id}`;

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };

  // Añadir un producto al carrito de compra
  //localhost:4000/users/farmer/addProductToCart/:buyer_id/:shop_product_id
  addProductToCart = (req, res) => {
    const { shop_product_id, buyer_id } = req.params;
    const { quantity } = req.body;

    let sql = `INSERT INTO shopping_cart (shop_product_id, buyer_id, quantity) VALUES (${shop_product_id}, ${buyer_id}, ${quantity})`;

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };

  // Selecciona la información del carrito de compra (producto y tienda)
  //localhost:4000/users/farmer/getShoppingCart/:buyer_id
  getShoppingCart = (req, res) => {
    const { buyer_id } = req.params;

    let sql = `SELECT shop_product.shop_product_id, shop.name as "shop_name", product.name, shopping_cart.quantity, shop_product.price, product.product_id, shop_product.stock FROM shop, shopping_cart, shop_product, product WHERE shopping_cart.buyer_id = ${buyer_id} AND shopping_cart.shop_product_id = shop_product.shop_product_id AND shop_product.product_id = product.product_id AND shop.shop_id = shop_product.shop_id`;

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };

  // Edita las cantidades de los productos en el carrito de la compra
  //localhost:4000/users/farmer/newQuantity/:buyer_id/:shop_product_id
  newQuantity = (req, res) => {
    const { shop_product_id, buyer_id } = req.params;
    const { quantity } = req.body;

    let sql = `UPDATE shopping_cart SET quantity = ${quantity} WHERE shop_product_id = ${shop_product_id} AND buyer_id = ${buyer_id}`;

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };

  // Elimina un producto del carrito de la compra
  //localhost:4000/users/farmer/deleteCartProduct/:buyer_id/:shop_product_id
  deleteCartProduct = (req, res) => {
    const { shop_product_id, buyer_id } = req.params;

    let sql = `DELETE FROM shopping_cart WHERE shop_product_id = ${shop_product_id} AND buyer_id = ${buyer_id}`;

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };

  // Trae la lista de las direcciones de envío del usuario
  //localhost:4000/users/farmer/getShippingAddresses/:user_id
  getShippingAddresses = (req, res) => {
    const user_id = req.params.user_id;

    let sql = `SELECT * FROM shipping_address WHERE user_id = ${user_id} AND deleted = 0`;

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };

  // Crea un pedido
  //localhost:4000/users/farmer/newOrder/:user_id/:shipping_address_id
  newOrder = (req, res) => {
    const { user_id, shipping_address_id } = req.params;
    const products = req.body;

    // Recoge la fecha del día de hoy
    let date = new Date().toISOString().slice(0, 10);
    // Cuenta el número de ids en la tabla de pedidos
    let countSQL = `SELECT COUNT(DISTINCT order_id) as 'count' FROM biobuk.order;`;

    connection.query(countSQL, (error, result) => {
      if (error) {
        res.status(400).json({ error });
      }
      let order_id = parseInt(result[0].count) + 1; // Genera el nuevo id de los pedidos
      let orders = [];
      for (let element of products) {
        let orderSQL = `INSERT INTO biobuk.order (order_id, buyer_id, shop_product_id, shipping_address_id, purchase_date, quantity, original_price) VALUES (${order_id}, ${user_id}, ${element.shop_product_id}, ${shipping_address_id}, '${date}', ${element.quantity}, ${element.price})`;

        let sql2 = `UPDATE shop_product SET shop_product.stock = shop_product.stock - ${element.quantity} WHERE shop_product_id = ${element.shop_product_id}`

        connection.query(orderSQL, (error2, result2) => {
          error2 ? res.status(400).json({ error2 }) : orders.push(result2); // Acumula el resultado de los pedidos nuevos
        });

        connection.query(sql2, (err, result2) => {
          error && res.status(400).json(error) // Actualiza el stock del producto de la tienda
        })

      }

      // Elimina todos los productos del carrito de la compra
      let cleanCartSQL = `DELETE FROM shopping_cart WHERE buyer_id = ${user_id}`;
      connection.query(cleanCartSQL, (error3, result3) => {
        error3 ? res.status(400).json({ error3 }) : res.status(200).json(order_id); 
      });
    });
  };

  // Información en un recibo de una compra realizada
  //localhost:4000/users/farmer/orderReceipt/:order_id
  orderReceipt = (req, res) => {
    const { order_id } = req.params;
    
    let sql = `SELECT biobuk.order.order_id, product.name as 'product_name', product.reference, shop.name as 'shop_name', biobuk.order.purchase_date, biobuk.order.quantity, biobuk.order.original_price, shipping_address.address, shipping_address.city, shipping_address.province, shipping_address.country
    FROM biobuk.order, shop_product, product, shop, shipping_address
    WHERE biobuk.order.shop_product_id = shop_product.shop_product_id 
    AND shop_product.product_id = product.product_id 
    AND shop_product.shop_id = shop.shop_id
    AND shipping_address.shipping_address_id = biobuk.order.shipping_address_id
    AND biobuk.order.order_id = ${order_id};`

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  }

  // Recoge todos los pedidos que ha realizado el agricultor
  //localhost:4000/users/farmer/getAllOrders/:buyer_id
  getAllOrders = (req, res) => {
    const { buyer_id } = req.params;
    let sql = `SELECT order_id, purchase_date, quantity, original_price, product.product_id, shop_product.shop_product_id, name, reference, price, stock from biobuk.order, product, shop_product where buyer_id = ${buyer_id} AND shop_product.shop_product_id = biobuk.order.shop_product_id AND shop_product.product_id = product.product_id ORDER BY order_id DESC`

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result)
    })
  }

  // Recoge la información de un pedido concreto del agricultor
  //localhost:4000/users/farmer/getOneOrder/:order_id
  getOneOrder = (req, res) => {
    let { order_id } = req.params;
    let sql = `SELECT order_id, purchase_date, quantity, original_price, product.product_id, shop_product.shop_product_id, name, reference, price, stock from biobuk.order, product, shop_product where order_id = ${order_id} AND shop_product.shop_product_id = biobuk.order.shop_product_id AND shop_product.product_id = product.product_id ORDER BY order_id DESC`
    connection.query(sql, (err, result) => {
      err ? res.status(400).json(err) : res.status(200).json(result)
    })
  }

}

module.exports = new farmerControllers();
