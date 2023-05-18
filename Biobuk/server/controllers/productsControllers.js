const connection = require("../config/db");

class productControllers {
  // Trae toda la información e imágenes de todos los productos
  //localhost:4000/products/getAllProducts
  getAllProducts = (req, res) => {
    let sql = `SELECT * FROM product WHERE deleted = 0`;
    let sql2 = `SELECT * FROM product_img WHERE deleted = 0`;

    connection.query(sql, (error, result) => {
      if (error) {
        res.status(400).json({ error });
      }
      connection.query(sql2, (err, resultImg) => {
        if (err) {
          res.status(400).json({ err });
        }

        res.status(200).json({ result, resultImg });
      });
    });
  };

  // Trae toda la información e imágenes de un producto concreto
  //localhost:4000/products/getOneProduct/:id
  getOneProduct = (req, res) => {
    let { id } = req.params;
    let sql = `SELECT * FROM product WHERE product_id = ${id} AND deleted = 0`;
    let sql2 = `SELECT * FROM product_img WHERE product_id = ${id} AND deleted = 0`;
    connection.query(sql, (error, result) => {
      if (error) {
        res.status(400).json({ error });
      }
      connection.query(sql2, (err, resultImg) => {
        if (err) {
          res.status(400).json({ err });
        }
        res.status(200).json({ result, resultImg });
      });
    });
  };

  // Crea un producto y trae la información de todos los productos 
  //localhost:4000/products/createProduct/user_id
  createProduct = (req, res) => {
    const user_id = req.params.user_id;
    const {
      name,
      reference,
      crop_type,
      composition,
      description,
      how_to_use,
      minimum_amount,
      duration,
    } = JSON.parse(req.body.newProduct);

    let img = [""];

    if (req.files != undefined) {
      img = req.files;
    }

    let sql = `INSERT INTO product (name, reference, crop_type, composition, description, how_to_use, minimum_amount, duration, user_id) VALUES ('${name}', '${reference}', '${crop_type}', '${composition}', '${description}',  '${how_to_use}', '${minimum_amount}', ${duration}, ${user_id});`;

    let sqlProduct = `SELECT * FROM product WHERE deleted = 0`;

    connection.query(sql, (error, result) => {
      if (error) res.status(400).json(error);
      let product_id = result.insertId;
      // Llama a la función de guardado de las imágenes de los productos
      this.saveProductImages(img, product_id);
      // Trae la información de los productos con el producto añadido
      connection.query(sqlProduct, (err, resultProduct) => {
        if (err) res.status(400);
        res.status(200).json(resultProduct);
      });
    });
  };

  // Guarda las imágenes de un producto
  saveProductImages = (images, product_id, next) => {
    let img = images;

    img.forEach((img) => {
      let sql = `INSERT INTO product_img (product_img_name, product_id) VALUES ('${img.filename}', ${product_id}) `;

      connection.query(sql, (error, result) => {
        if (error) throw error;
      });
    });
  };

  // Edita un producto concreto
  //localhost:4000/products/editProduct/:product_id
  editProduct = (req, res) => {
    const {
      name,
      reference,
      crop_type,
      composition,
      description,
      how_to_use,
      minimum_amount,
      duration,
    } = JSON.parse(req.body.editProduct);

    const product_id = req.params.product_id;

    let img = [""];

    if (req.files != undefined) {
      img = req.files;
    }

    let sql = `UPDATE product SET name='${name}', reference='${reference}', crop_type = '${crop_type}',  composition='${composition}', description='${description}', how_to_use='${how_to_use}',  minimum_amount='${minimum_amount}', duration = '${duration}' WHERE product_id = ${product_id}`;

    connection.query(sql, (error, result) => {
      if (error) res.status(400);
      // Llama a la función de guardado de imágenes
      this.saveProductImages(img, product_id);
      res.status(200).json(result);
    });
  };

  // Elimina un producto
  //localhost:4000/products/deleteProduct/:product_id
  deleteProduct = (req, res) => {
    const product_id = req.params.product_id;

    let sql = `UPDATE product SET deleted = true WHERE product_id = ${product_id}`;

    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };

  // Rescata la información de todos los comentarios de un producto
  //localhost:4000/products/comments/:product_id
  viewComments = (req, res) => {
    const { product_id } = req.params;
    let sql = `SELECT commentary.commentary_id, commentary.commentary_text, commentary.rating, commentary.product_id, commentary.user_id, user.name, user.lastname FROM commentary, user WHERE commentary.user_id = user.user_id AND commentary.product_id = ${product_id} && commentary.deleted = 0`;
    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };

  // Elimina una imagen de un producto
  //localhost:4000/products/deleteImg/:product_img_id
  deleteImg = (req, res) => {
    const product_img_id = req.params.product_img_id;
    let sql = `UPDATE product_img SET deleted = true WHERE product_img_id = ${product_img_id}`;
    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  };

  // Rescata la información con el precio y el stock de un producto concreto en diferentes tiendas
  // localhost:4000/products/getShopsPrices/:product_id
  getShopsPrices = (req, res) => {
    const { product_id } = req.params;

    let sql = `SELECT shop.shop_id, shop.name, shop_product.shop_product_id, shop_product.price, shop_product.stock, shop_product.product_id FROM shop, shop_product WHERE shop_product.shop_id = shop.shop_id AND shop_product.product_id = ${product_id} AND shop_product.deleted = 0;`;
    connection.query(sql, (error, result) => {
      error ? res.status(400).json({ error }) : res.status(200).json(result);
    });
  }

}


module.exports = new productControllers();
